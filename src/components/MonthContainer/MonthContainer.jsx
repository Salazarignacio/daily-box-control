import { useState, useContext } from 'react';
import DayContainer from '../DayContainer/DayContainer'
import { useParams, useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon';
import { ThemeContext } from '../../App';

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
  const [activeView, setActiveView] = useState('day'); 
  const currentYear = parseInt(yearId);
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);

  const [navDate, setNavDate] = useState(DateTime.now());
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [animationClass, setAnimationClass] = useState('');

  // Generamos una lista de años
  const years = [];
  for (let i = 2023; i <= DateTime.now().year + 10; i++) {
    years.push(i);
  }

  const handleYearChange = (e) => {
    navigate(`/months/${e.target.value}`);
  };

  const nextMonth = () => {
    setAnimationClass('slide-left');
    setTimeout(() => {
      setNavDate(navDate.plus({ months: 1 }));
      setAnimationClass('slide-in-right');
    }, 200);
  };

  const prevMonth = () => {
    setAnimationClass('slide-right');
    setTimeout(() => {
      setNavDate(navDate.minus({ months: 1 }));
      setAnimationClass('slide-in-left');
    }, 200);
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) nextMonth();
    if (isRightSwipe) prevMonth();
  };

  return (
    <div className={activeView === 'day' ? 'day-view-layout' : 'year-view-layout'}>
      <div className="AppHeader">
        <button 
          className="ThemeToggle" 
          onClick={() => setIsDarkMode(!isDarkMode)}
          title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
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
        <div 
          className="MonthNavigationContainer"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className={`SingleMonthView ${animationClass}`}>
            <DayContainer 
              key={`${navDate.month}-${navDate.year}`} 
              month={navDate.month} 
              year={navDate.year} 
            />
          </div>
          
          <div className="BottomNavigation">
            <button className="nav-arrow" onClick={prevMonth}>‹</button>
            <span className="nav-month-label">{navDate.monthLong.toUpperCase()} {navDate.year}</span>
            <button className="nav-arrow" onClick={nextMonth}>›</button>
          </div>
        </div>
      )}
    </div>
  );
}

