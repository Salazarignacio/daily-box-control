import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import MonthsContainer from "./components/MonthContainer/MonthContainer";
import { createContext, useState, useEffect } from "react";
import { DateTime } from "luxon";

export const ThemeContext = createContext();

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : false; // Light mode by default now
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
  
  // Obtenemos el año actual automáticamente
  const currentYear = DateTime.now().year;

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      <BrowserRouter>
        <Routes>
          {/* Si entran a la raíz, redirigimos al año actual */}
          <Route path="/" element={<Navigate to={`/months/${currentYear}`} replace />} />
          
          {/* La vista principal ahora es el calendario del año elegido */}
          <Route exact path="/months/:yearId" element={<MonthsContainer />} />
        </Routes>
      </BrowserRouter>
    </ThemeContext.Provider>
  );
}

export default App;
