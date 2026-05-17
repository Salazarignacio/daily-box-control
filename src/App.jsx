import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import MonthsContainer from "./components/MonthContainer/MonthContainer";
import { createContext, useState, useEffect } from "react";
import { DateTime } from "luxon";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/Login/ProtectedRoute";
import Login from "./components/Login/Login";
import { seedTestUsers } from "./utils/seedUsers";

export const ThemeContext = createContext();

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // CORRECCIÓN: El UID correcto es liLM... (sin la 'c' inicial)
    seedTestUsers('liLM1DTsTybLpA2YI2kehB8XBuS2', 'ZUFsYDMDyMb001BrGObo3MVaKOC3');
  }, []);

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

  // Variable de entorno para manejar el login (por defecto false si no existe)
  const isAuthEnabled = import.meta.env.VITE_ENABLE_AUTH === 'true';

  const renderProtected = (element) => {
    return isAuthEnabled ? <ProtectedRoute>{element}</ProtectedRoute> : element;
  };

  return (
    <AuthProvider>
      <ThemeContext.Provider value={{ isDarkMode, isModalOpen, setIsModalOpen }}>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/" element={
              renderProtected(<Navigate to={`/months/${currentYear}`} replace />)
            } />
            
            <Route exact path="/months/:yearId" element={
              renderProtected(<MonthsContainer />)
            } />
          </Routes>
        </BrowserRouter>
      </ThemeContext.Provider>
    </AuthProvider>
  );
}

export default App;
