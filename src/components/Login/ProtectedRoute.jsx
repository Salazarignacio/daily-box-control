import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // O un spinner con el estilo de la app
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}
