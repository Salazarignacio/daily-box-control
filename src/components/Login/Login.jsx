import { useState } from 'react';
import { auth } from '../../components/SendData/fbConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError('Credenciales incorrectas o error de conexión.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ 
      minHeight: '100vh', 
      width: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'var(--bg-main)',
      padding: '1rem'
    }}>
      <div className="section-card" style={{ 
        maxWidth: '360px', 
        width: '100%',
        padding: '1.5rem 2rem', 
        border: '1px solid var(--border-color)',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
        background: 'var(--card-bg)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ 
            color: 'var(--text-main)', 
            fontWeight: '200', 
            fontSize: '1.5rem', 
            marginBottom: '0.4rem',
            letterSpacing: '1px'
          }}>
            LOGIN
          </h2>
          <div style={{ 
            width: '30px', 
            height: '2px', 
            background: 'var(--accent-gold)', 
            margin: '0 auto' 
          }}></div>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="input-group">
            <label style={{ fontSize: '0.6rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>EMAIL</label>
            <input 
              className="text" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="usuario@correo.com"
            />
          </div>

          <div className="input-group">
            <label style={{ fontSize: '0.6rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>CONTRASEÑA</label>
            <input 
              className="text" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p style={{ color: 'var(--danger)', fontSize: '0.7rem', fontWeight: '700', textAlign: 'center', margin: '0.5rem 0' }}>
              {error}
            </p>
          )}

          <button 
            className="btn-send" 
            type="submit" 
            disabled={loading}
            style={{ height: '3.2rem', marginTop: '0.5rem', fontSize: '1rem' }}
          >
            {loading ? 'CONECTANDO...' : 'ENTRAR'}
          </button>
        </form>
      </div>
    </div>
  );
}
