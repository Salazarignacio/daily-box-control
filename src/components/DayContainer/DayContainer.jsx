import { useState, useEffect, useCallback } from "react";
import { DateTime } from "luxon";
import DayList from "./DayList";
import EmptyDay from "./EmpityDay";
import MonthlyExpenses from "./MonthlyExpenses";
import { componentsQuantity } from "../MonthContainer/MonthContainer";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../SendData/fbConfig";
import { formatNumber, parseNumber, getNum } from "../../utils/format";

const DB_FIRE = import.meta.env.VITE_DB_FIRE;
const SHEET_URL = import.meta.env.VITE_SHEET_URL;

export default function DayContainer({ month, year, autoOpenToday }) {
  const [monthlyTotals, setMonthlyTotals] = useState({ ventas: 0, gastos: 0 });
  const [daysData, setDaysData] = useState({});
  const [fixedExpenses, setFixedExpenses] = useState(0);
  const [showFixedModal, setShowFixedModal] = useState(false);
  const [showTotals, setShowTotals] = useState(false);
  const [animatedTotals, setAnimatedTotals] = useState({ ventas: 0, gastos: 0 });
  const today = DateTime.now();

  // Audio effects using Web Audio API (No external files needed)
  const playPop = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      console.log('Audio API not supported');
    }
  };

  // Animación de contadores
  useEffect(() => {
    if (showTotals) {
      const duration = 800;
      const startTime = performance.now();
      const startV = animatedTotals.ventas;
      const startG = animatedTotals.gastos;

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);

        setAnimatedTotals({
          ventas: Math.floor(startV + (monthlyTotals.ventas - startV) * ease),
          gastos: Math.floor(startG + (monthlyTotals.gastos - startG) * ease)
        });

        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [showTotals, monthlyTotals]);

  const monthNumber = DateTime.local(year, month);
  const monthName = DateTime.local(year, month, 1).monthLong.charAt(0).toUpperCase() + DateTime.local(year, month, 1).monthLong.slice(1);
  const fullMonthName = `${monthName} ${year}`;

  const whatDayIs = (a) => {
    return DateTime.local(year, month, a).weekdayLong.toLocaleString(DateTime.DATE_HUGE);
  };

  const loadFixedExpenses = useCallback(() => {
    if (DB_FIRE) {
      const ref = doc(db, DB_FIRE, `${fullMonthName}_FIXED`);
      getDoc(ref).then((snap) => {
        if (snap.exists()) {
          const total = snap.data().expenses.reduce((acc, curr) => acc + getNum(curr.v), 0);
          setFixedExpenses(total);
        } else {
          setFixedExpenses(0);
        }
      });
    }
  }, [fullMonthName]);

  useEffect(() => {
    loadFixedExpenses();
  }, [loadFixedExpenses]);

  const handleDataLoaded = useCallback((day, data) => {
    setDaysData(prev => {
      if (JSON.stringify(prev[day]) === JSON.stringify(data)) return prev;
      return { ...prev, [day]: data };
    });
  }, []);

  useEffect(() => {
    let v = 0; let g = 0;

    Object.values(daysData).forEach(day => {
      let gEfe = day.cashExpenses ? day.cashExpenses.reduce((acc, curr) => acc + getNum(curr.v), 0) : getNum(day.a) + getNum(day.b) + getNum(day.c) + getNum(day.d) + getNum(day.e) + getNum(day.f) + getNum(day.g) + getNum(day.h) + getNum(day.i) + getNum(day.j);
      let gDig = day.digitalExpenses ? day.digitalExpenses.reduce((acc, curr) => acc + getNum(curr.v), 0) : getNum(day.uno) + getNum(day.dos) + getNum(day.tres);
      let vDig = day.digitalSales ? day.digitalSales.reduce((acc, curr) => acc + getNum(curr.v), 0) : getNum(day.mp) + getNum(day.bsf);
      v += (getNum(day.efFinal) + gEfe + vDig) - getNum(day.efInicial);
      g += (gEfe + gDig);
    });
    setMonthlyTotals({ ventas: v, gastos: g });
  }, [daysData]);

  const refreshDay = useCallback((dayNumber) => {
    const todayStr = DateTime.local(year, month, dayNumber).toLocaleString(DateTime.DATE_FULL);
    getDoc(doc(db, DB_FIRE, todayStr)).then((snap) => {
      if (snap.exists()) setDaysData(prev => ({ ...prev, [dayNumber]: snap.data() }));
    });
  }, [year, month]);

  const renderCalendarItems = () => {
    const items = [];
    const emptyMap = { "domingo": 6, "sábado": 5, "viernes": 4, "jueves": 3, "miércoles": 2, "martes": 1, "lunes": 0 };
    const emptiesCount = emptyMap[whatDayIs(1)] || 0;
    for (let i = 0; i < emptiesCount; i++) items.push(<EmptyDay key={`empty-${i}`} />);
    componentsQuantity(monthNumber.daysInMonth).forEach((d) => {
      const isToday = d === today.day && month === today.month && year === today.year;
      items.push(<DayList key={`day-${d}`} day={d} month={month} year={year} data={daysData[d]} onDataLoaded={handleDataLoaded} onRefresh={refreshDay} autoOpen={isToday ? autoOpenToday : false} />);
    });
    return items;
  };

  const rendimientoNeto = monthlyTotals.ventas - monthlyTotals.gastos - fixedExpenses;
  const gastoPorcentaje = monthlyTotals.ventas > 0 ? Math.min((monthlyTotals.gastos / monthlyTotals.ventas) * 100, 100) : 0;

  return (
    <div className="Contenedor">
      <div className="MonthHeader">
        <h1>{monthName.toUpperCase()}</h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button 
            onClick={() => { playPop(); setShowTotals(!showTotals); }} 
            className="btn-toggle-stats"
            title="Ver totales del mes"
          >
            {showTotals ? '👁️' : '📊'}
          </button>
          <button 
            onClick={() => { playPop(); window.open(SHEET_URL, '_blank'); }} 
            className="btn-open-sheet"
            title="Abrir Planilla Google"
          >
            📄
          </button>
          <button 
            onClick={() => { playPop(); setShowFixedModal(true); }} 
            className="btn-add-monthly"
            title="Añadir gastos fijos"
          >
            +
          </button>
        </div>
      </div>
      
      {showTotals && (
        <div className="MonthlySummary" style={{ animation: 'modalShow 0.3s ease', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span className="v-total">V: ${formatNumber(animatedTotals.ventas)}</span>
                <span className="g-total">G: ${formatNumber(animatedTotals.gastos)}</span>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>FIJOS: ${formatNumber(fixedExpenses)}</span>
                <span style={{ color: rendimientoNeto >= 0 ? 'var(--success)' : 'var(--danger)', borderTop: '1px solid var(--border-color)', paddingTop: '2px' }}>
                    NETO: ${formatNumber(rendimientoNeto)}
                </span>
            </div>
          </div>
          
          <div className="ProgressContainer" title={`${gastoPorcentaje.toFixed(1)}% de ventas en gastos`}>
            <div className="ProgressBar" style={{ width: `${gastoPorcentaje}%`, backgroundColor: gastoPorcentaje > 80 ? 'var(--danger)' : 'var(--accent-gold)' }}></div>
          </div>
        </div>
      )}

      <div className="DaysContainer">{renderCalendarItems()}</div>

      {showFixedModal && (
        <MonthlyExpenses 
          monthName={monthName} 
          year={year} 
          onClose={() => setShowFixedModal(false)} 
          onRefresh={loadFixedExpenses}
        />
      )}
    </div>
  );
}
