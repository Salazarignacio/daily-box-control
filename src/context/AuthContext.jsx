import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../components/SendData/fbConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthEnabled = import.meta.env.VITE_ENABLE_AUTH === 'true';
  const isClientRestricted = import.meta.env.VITE_RESTRICT_CLIENT === 'true';

  const logout = () => signOut(auth);

  useEffect(() => {
    // Si el login está desactivado, forzamos rol ADMIN para la demo
    if (!isAuthEnabled) {
      setRole('ADMIN');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setRole(data.role);
          } else {
            setRole('CLIENT');
          }
        } catch (error) {
          setRole('CLIENT');
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAuthEnabled]);

  const isAdmin = role === 'ADMIN';
  // Solo se restringen funciones si el login está activo, el usuario es CLIENT Y la variable de restricción es 'true'
  const canSeeAll = !isAuthEnabled || isAdmin || !isClientRestricted;

  return (
    <AuthContext.Provider value={{ user, role, loading, logout, isAuthEnabled, isAdmin, canSeeAll }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
