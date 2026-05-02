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
  const currentYear = parseInt(yearId);

  // Generamos una lista de años (desde el 2023 hasta 10 años en el futuro)
  const years = [];
  for (let i = 2023; i <= DateTime.now().year + 10; i++) {
    years.push(i);
  }

  const handleYearChange = (e) => {
    navigate(`/months/${e.target.value}`);
  };

  return (
    <>
      <div className="AppHeader" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem', width: '100%' }}>
        <h1 style={{ marginBottom: '1rem' }}>Control de Caja Diario</h1>
        
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
      </div>

      <div className="Months">
        {componentsQuantity(12).map((a, b) => {
          return <DayContainer key={b} month={a} year={currentYear}/>;
        })}
      </div>
    </>
  );
}
