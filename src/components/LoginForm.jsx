import { useState } from 'react';
import { useLoginUser } from '../hooks/useLoginUser';
import { Link } from 'react-router-dom';

export default function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { loginUser, loading, error } = useLoginUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await loginUser(email, password);
      if (onLoginSuccess) {
        onLoginSuccess(result);
      }
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-medium text-center mb-8">Iniciar sesión</h1>
      
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 border-l-4 border-red-500 bg-red-50 text-sm text-red-600">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm text-gray-500 mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="input-field"
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-500 mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              className="input-field"
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            className="btn-primary w-full"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
          
          <div className="text-center text-sm text-gray-500 pt-4">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="text-black hover:underline">
              Regístrate aquí
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}