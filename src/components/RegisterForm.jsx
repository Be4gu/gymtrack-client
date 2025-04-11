import { useState } from 'react';
import { useRegisterUser } from '../hooks/useRegisterUser';
import { Link } from 'react-router-dom';

export default function RegisterForm({ onRegisterSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [formError, setFormError] = useState('');
  
  const { registerUser, loading, error } = useRegisterUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (password !== confirmPassword) {
      setFormError('Las contraseñas no coinciden');
      return;
    }
    
    try {
      const result = await registerUser(email, password, name);
      if (onRegisterSuccess) {
        onRegisterSuccess(result);
      }
    } catch (err) {
      // Set form error for exceptions not caught by the hook
      setFormError(err.message || 'Error durante el registro');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-medium text-center mb-8">Crear cuenta</h1>
      
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {(error || formError) && (
            <div className="p-4 border-l-4 border-red-500 bg-red-50 text-sm text-red-600">
              {formError || error}
            </div>
          )}
          
          <div>
            <label className="block text-sm text-gray-500 mb-2" htmlFor="name">
              Nombre
            </label>
            <input
              className="input-field"
              id="name"
              type="text"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
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
          
          <div>
            <label className="block text-sm text-gray-500 mb-2" htmlFor="confirmPassword">
              Confirmar contraseña
            </label>
            <input
              className="input-field"
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            className="btn-primary w-full"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
          
          <div className="text-center text-sm text-gray-500 pt-4">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-black hover:underline">
              Inicia sesión aquí
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}