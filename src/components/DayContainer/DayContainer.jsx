import React, { useState, useEffect, useCallback } from "react";
import { DateTime } from "luxon";
import DayList from "./DayList";
import EmptyDay from "./EmpityDay";
import { componentsQuantity } from "../MonthContainer/MonthContainer";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../SendData/fbConfig";

const DB_FIRE = import.meta.env.VITE_DB_FIRE;

export default function DayContainer({ month, year }) {
  const [monthlyTotals, setMonthlyTotals] = useState({ ventas: 0, gastos: 0 });
  const [daysData, setDaysData] = useState({});

  const monthNumber = DateTime.local(year, month);
  const monthName = DateTime.local(year, month, 1)
    .monthLong.toLocaleString(DateTime.DATE_HUGE)
    .toUpperCase();

  const whatDayIs = (a) => {
    return DateTime.local(year, month, a).weekdayLong.toLocaleString(
      DateTime.DATE_HUGE,
    );
  };

  const handleDataLoaded = useCallback((day, data) => {
    setDaysData(prev => {
      if (JSON.stringify(prev[day]) === JSON.stringify(data)) return prev;
      return { ...prev, [day]: data };
    });
  }, []);

  useEffect(() => {
    let v = 0;
    let g = 0;
    const getNum = (val) => parseFloat(val) || 0;

    Object.values(daysData).forEach(day => {
      let gEfectivo = 0;
      if (day.cashExpenses) {
        gEfectivo = day.cashExpenses.reduce((acc, curr) => acc + getNum(curr.v), 0);
      } else {
        gEfectivo = getNum(day.a) + getNum(day.b) + getNum(day.c) + getNum(day.d) + getNum(day.e) + getNum(day.f) + getNum(day.g) + getNum(day.h) + getNum(day.i) + getNum(day.j);
      }
      
      let gDigital = 0;
      if (day.digitalExpenses) {
        gDigital = day.digitalExpenses.reduce((acc, curr) => acc + getNum(curr.v), 0);
      } else {
        gDigital = getNum(day.uno) + getNum(day.dos) + getNum(day.tres);
      }

      let vDigital = 0;
      if (day.digitalSales) {
        vDigital = day.digitalSales.reduce((acc, curr) => acc + getNum(curr.v), 0);
      } else {
        vDigital = getNum(day.mp) + getNum(day.bsf);
      }

      v += (getNum(day.efFinal) + gEfectivo + vDigital) - getNum(day.efInicial);
      g += (gEfectivo + gDigital);
    });

    setMonthlyTotals({ ventas: v, gastos: g });
  }, [daysData]);

  const refreshDay = useCallback((dayNumber) => {
    const todayStr = DateTime.local(year, month, dayNumber).toLocaleString(DateTime.DATE_FULL);
    const ref = doc(db, DB_FIRE, todayStr);
    getDoc(ref).then((snap) => {
      if (snap.exists()) {
        setDaysData(prev => ({ ...prev, [dayNumber]: snap.data() }));
      }
    });
  }, [year, month]);

  // --- LÓGICA DE GRILLA PLANA ---
  const renderCalendarItems = () => {
    const items = [];
    const firstDay = whatDayIs(1);
    
    // Mapeo de días de la semana a cantidad de espacios vacíos
    const emptyMap = {
        "domingo": 6, "sábado": 5, "viernes": 4, "jueves": 3, "miércoles": 2, "martes": 1, "lunes": 0
    };
    
    const emptiesCount = emptyMap[firstDay] || 0;
    
    for (let i = 0; i < emptiesCount; i++) {
      items.push(<EmptyDay key={`empty-${i}`} />);
    }
    
    componentsQuantity(monthNumber.daysInMonth).forEach((d) => {
      items.push(
        <DayList
          key={`day-${d}`}
          day={d}
          month={month}
          year={year}
          dayName={whatDayIs(d)}
          onDataLoaded={handleDataLoaded}
          onRefresh={refreshDay}
        />
      );
    });
    
    return items;
  };

  return (
    <div className="Contenedor">
      <h1>{monthName}</h1>
      
      <div className="MonthlySummary">
        <span className="v-total">VENTAS: ${monthlyTotals.ventas.toLocaleString()}</span>
        <span className="g-total">GASTOS: ${monthlyTotals.gastos.toLocaleString()}</span>
      </div>

      <div className="DaysContainer">
        {renderCalendarItems()}
      </div>
    </div>
  );
}
