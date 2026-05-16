import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import MonthsContainer from "./components/MonthContainer/MonthContainer";
import { createContext, useState, useEffect } from "react";
import { DateTime } from "luxon";

export const ThemeContext = createContext();

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      setIsDarkMode(e.matches);
    };

    // Escuchamos cambios en la preferencia del sistema
    mediaQuery.addEventListener('change', handleChange);

    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isDarkMode]);
  
  // Obtenemos el año actual automáticamente
  const currentYear = DateTime.now().year;

  return (
    <ThemeContext.Provider value={{ isDarkMode }}>
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
