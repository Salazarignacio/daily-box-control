import { useState, useContext, useEffect, useRef } from 'react';
import DayContainer from '../DayContainer/DayContainer'
import { useParams, useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon';
import { ThemeContext } from '../../App';
import { motion, useMotionValue, useTransform } from 'framer-motion';

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
  const { isDarkMode } = useContext(ThemeContext);

  const [navDate, setNavDate] = useState(DateTime.now());
  const today = DateTime.now();
  const [autoOpenToday, setAutoOpenToday] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [animationClass, setAnimationClass] = useState('');

  // Lógica para el arrastre del selector
  const selectorRef = useRef(null);
  const x = useMotionValue(0);

  const handleOpenToday = () => {
    playClick();
    setNavDate(DateTime.now());
    setAutoOpenToday(true);
    setTimeout(() => setAutoOpenToday(false), 100);
  };

  const handleDragEnd = (event, info) => {
    const threshold = 50;
    if (info.offset.x > threshold && activeView === 'day') {
      setActiveView('year');
      playClick();
    } else if (info.offset.x < -threshold && activeView === 'year') {
      setActiveView('day');
      playClick();
    }
  };

  // Generamos una lista de años
  const years = [];
  for (let i = 2023; i <= DateTime.now().year + 10; i++) {
    years.push(i);
  }

  const handleYearChange = (e) => {
    navigate(`/months/${e.target.value}`);
  };

  // Audio effects using Web Audio API (No external files needed)
  const playClick = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);

      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
      console.log('Audio API not supported');
    }
  };

  const nextMonth = () => {
    playClick();
    setAnimationClass('slide-left');
    setTimeout(() => {
      setNavDate(navDate.plus({ months: 1 }));
      setAnimationClass('slide-in-right');
    }, 200);
  };

  const prevMonth = () => {
    playClick();
    setAnimationClass('slide-right');
    setTimeout(() => {
      setNavDate(navDate.minus({ months: 1 }));
      setAnimationClass('slide-in-left');
    }, 200);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const key = e.key.toLowerCase();
      if (key === 'd') { handleOpenToday(); }
      if (key === 'm') { playClick(); setActiveView('day'); }
      if (key === 'a') { playClick(); setActiveView('year'); }
      if (activeView === 'day') {
        if (e.key === 'ArrowLeft') prevMonth();
        if (e.key === 'ArrowRight') nextMonth();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeView, navDate]);

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

  const renderActiveView = () => {
    if (activeView === 'year') {
      return (
        <div className="Months">
          {componentsQuantity(12).map((a, b) => {
            const isCurrentMonth = a === today.month && currentYear === today.year;
            return <DayContainer 
              key={b} 
              month={a} 
              year={currentYear} 
              autoOpenToday={isCurrentMonth ? autoOpenToday : false} 
            />;
          })}
        </div>
      );
    }

    return (
      <div 
        className="MonthNavigationWrapper"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="MainNavigationRow">
          <button className="nav-arrow side-arrow left" onClick={prevMonth}>‹</button>
          
          <div className={`SingleMonthView ${animationClass}`}>
            <DayContainer 
              key={`${navDate.month}-${navDate.year}`} 
              month={navDate.month} 
              year={navDate.year} 
              autoOpenToday={navDate.month === today.month && navDate.year === today.year ? autoOpenToday : false}
            />
          </div>
          
          <button className="nav-arrow side-arrow right" onClick={nextMonth}>›</button>
        </div>
        
        <div className="BottomNavigation">
          <button className="nav-arrow bottom-only" onClick={prevMonth}>‹</button>
          <span className="nav-month-label">{navDate.monthLong.toUpperCase()} {navDate.year}</span>
          <button className="nav-arrow bottom-only" onClick={nextMonth}>›</button>
        </div>
      </div>
    );
  };

  return (
    <div className={activeView === 'day' ? 'day-view-layout' : 'year-view-layout'}>
      <div className="AppHeader">
        <div className="ViewSelector" ref={selectorRef}>
          <button 
            onClick={handleOpenToday}
            className={`view-btn ${autoOpenToday ? 'active' : ''}`}
          >
            <span className="btn-content">
                <span className="icon">🕒</span> 
                <span className="text">Día</span>
            </span>
            {autoOpenToday && (
              <motion.div 
                layoutId="active-pill"
                className="active-indicator-pill"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
          </button>
          
          <button 
            onClick={() => setActiveView('day')}
            className={`view-btn ${activeView === 'day' ? 'active' : ''}`}
          >
            <span className="btn-content">
                <span className="icon">🗓️</span> 
                <span className="text">Mes</span>
            </span>
            {activeView === 'day' && (
              <motion.div 
                layoutId="active-pill"
                className="active-indicator-pill"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
          </button>
          
          <button 
            onClick={() => setActiveView('year')}
            className={`view-btn ${activeView === 'year' ? 'active' : ''}`}
          >
            <span className="btn-content">
                <span className="icon">📅</span> 
                <span className="text">Año</span>
            </span>
            {activeView === 'year' && (
              <motion.div 
                layoutId="active-pill"
                className="active-indicator-pill"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
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

      {renderActiveView()}
    </div>
  );
}

