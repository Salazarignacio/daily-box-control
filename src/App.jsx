import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import MonthsContainer from "./components/MonthContainer/MonthContainer";
import { createContext, useState } from "react";
import { DateTime } from "luxon";

export const ThemeContext = createContext();

function App() {
  const [off, setOff] = useState(false);
  
  // Obtenemos el año actual automáticamente
  const currentYear = DateTime.now().year;

  return (
    <ThemeContext.Provider value={{ off, setOff }}>
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
