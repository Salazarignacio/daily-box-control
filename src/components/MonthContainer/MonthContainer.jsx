import { useState } from 'react';
import DayContainer from '../DayContainer/DayContainer'
import { useParams, useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon';

export const componentsQuantity = (date) => {
  const time = [];
  for (let i = 1; i < date + 1; i++) {
    time.push(i);
  }
  return time;
};

export default function MonthsContainer() {
  const { yearId } = useParams();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('day'); // 'day' is now the default
  const currentYear = parseInt(yearId);

  // Generamos una lista de años (desde el 2023 hasta 10 años en el futuro)
  const years = [];
  for (let i = 2023; i <= DateTime.now().year + 10; i++) {
    years.push(i);
  }

  const handleYearChange = (e) => {
    navigate(`/months/${e.target.value}`);
  };

  const now = DateTime.now();
  const currentMonth = now.month;
  const realCurrentYear = now.year;

  return (
    <div className={activeView === 'day' ? 'day-view-layout' : 'year-view-layout'}>
      <div className="AppHeader">
        <div className="ViewSelector">
          <button 
            onClick={() => setActiveView('day')}
            className={activeView === 'day' ? 'active' : ''}
          >
            <span className="icon">☀️</span> 
            <span className="text">Mensual</span>
          </button>
          <button 
            onClick={() => setActiveView('year')}
            className={activeView === 'year' ? 'active' : ''}
          >
            <span className="icon">📅</span> 
            <span className="text">Anual</span>
          </button>
        </div>

        <h1>Control de Caja Diario</h1>
        
        {activeView === 'year' && (
          <div className="YearSelector">
            <label>Viendo el Año:</label>
            <select value={currentYear} onChange={handleYearChange}>
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {activeView === 'year' ? (
        <div className="Months">
          {componentsQuantity(12).map((a, b) => {
            return <DayContainer key={b} month={a} year={currentYear}/>;
          })}
        </div>
      ) : (
        <div className="SingleMonthView">
          <DayContainer month={currentMonth} year={realCurrentYear} />
        </div>
      )}
    </div>
  );
}
