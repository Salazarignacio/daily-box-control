import React, { useState, useEffect, useCallback } from "react";
import { DateTime } from "luxon";
import DayList from "./DayList";
import EmptyDay from "./EmpityDay";
import MonthlyExpenses from "./MonthlyExpenses";
import { componentsQuantity } from "../MonthContainer/MonthContainer";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../SendData/fbConfig";

const DB_FIRE = import.meta.env.VITE_DB_FIRE;

export default function DayContainer({ month, year }) {
  const [monthlyTotals, setMonthlyTotals] = useState({ ventas: 0, gastos: 0 });
  const [daysData, setDaysData] = useState({});
  const [fixedExpenses, setFixedExpenses] = useState(0);
  const [showFixedModal, setShowFixedModal] = useState(false);
  const [showTotals, setShowTotals] = useState(false);

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
          const total = snap.data().expenses.reduce((acc, curr) => acc + (parseFloat(curr.v) || 0), 0);
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
    const getNum = (val) => parseFloat(val) || 0;

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
      items.push(<DayList key={`day-${d}`} day={d} month={month} year={year} onDataLoaded={handleDataLoaded} onRefresh={refreshDay} />);
    });
    return items;
  };

  const rendimientoNeto = monthlyTotals.ventas - monthlyTotals.gastos - fixedExpenses;

  return (
    <div className="Contenedor">
      <div className="MonthHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', background: 'var(--primary)', padding: '0.5rem 1rem', borderRadius: '0.75rem' }}>
        <h1 style={{ margin: 0, background: 'transparent', fontSize: '1rem' }}>{monthName.toUpperCase()}</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setShowTotals(!showTotals)} 
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '8px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold' }}
          >
            {showTotals ? '👁️' : '📊'}
          </button>
          <button onClick={() => setShowFixedModal(true)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '50%', width: '1.8rem', height: '1.8rem', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
        </div>
      </div>
      
      {showTotals && (
        <div className="MonthlySummary" style={{ animation: 'modalShow 0.3s ease' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span className="v-total">V: ${monthlyTotals.ventas.toLocaleString()}</span>
              <span className="g-total">G: ${monthlyTotals.gastos.toLocaleString()}</span>
          </div>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>FIJOS: ${fixedExpenses.toLocaleString()}</span>
              <span style={{ color: rendimientoNeto >= 0 ? 'var(--success)' : 'var(--danger)', borderTop: '1px solid #ddd', paddingTop: '2px' }}>
                  NETO: ${rendimientoNeto.toLocaleString()}
              </span>
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
