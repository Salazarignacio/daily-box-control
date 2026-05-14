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
    <>
      <div className="AppHeader" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem', width: '100%' }}>
        
        <div className="ViewSelector" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', background: '#f1f5f9', padding: '0.5rem', borderRadius: '1rem' }}>
          <button 
            onClick={() => setActiveView('day')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer',
              background: activeView === 'day' ? 'white' : 'transparent',
              boxShadow: activeView === 'day' ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none',
              fontWeight: '600', color: activeView === 'day' ? 'var(--primary)' : '#64748b', transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>☀️</span> Mes Actual
          </button>
          <button 
            onClick={() => setActiveView('year')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '0.75rem', border: 'none', cursor: 'pointer',
              background: activeView === 'year' ? 'white' : 'transparent',
              boxShadow: activeView === 'year' ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none',
              fontWeight: '600', color: activeView === 'year' ? 'var(--primary)' : '#64748b', transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>📅</span> Vista Anual
          </button>
        </div>

        <h1 style={{ marginBottom: '1rem' }}>Control de Caja Diario</h1>
        
        {activeView === 'year' && (
          <div className="YearSelector" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'white', padding: '0.75rem 1.5rem', borderRadius: '1rem', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <label style={{ fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Viendo el Año:</label>
            <select 
              value={currentYear} 
              onChange={handleYearChange}
              style={{ padding: '0.5rem 1rem', fontSize: '1.2rem', fontWeight: '800', border: 'none', background: 'transparent', color: 'var(--primary)', cursor: 'pointer', outline: 'none' }}
            >
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
    </>
  );
}
