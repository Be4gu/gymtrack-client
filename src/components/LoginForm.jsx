import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';

export default function LoginForm({ onLoginSuccess }) {
  const { googleLogin, loading: googleLoading } = useGoogleAuth();
  const [authError, setAuthError] = useState(null);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log('Respuesta de Google:', credentialResponse);
      // credentialResponse contiene directamente el credential (id_token)
      const result = await googleLogin(credentialResponse);
      if (onLoginSuccess) {
        onLoginSuccess(result);
      }
    } catch (err) {
      console.error('Error con autenticación de Google:', err);
      setAuthError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-medium text-center mb-8">Iniciar sesión</h1>
      <div className="card">
        <div className="flex justify-center mb-4">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={(error) => {
              console.error('Error de inicio de sesión con Google:', error);
              setAuthError('Error al conectar con Google. Verifica que el origen esté configurado en Google Cloud.');
            }}
            useOneTap
            text="signin_with"
            shape="pill"
          />
        </div>
        {googleLoading && (
          <p className="text-center text-sm text-textSecondary mt-4">
            Conectando con Google...
          </p>
        )}
        {authError && (
          <div className="mt-4 p-3 border-l-4 border-red-500 bg-red-50 text-red-700">
            <p className="text-sm">{authError}</p>
            <p className="text-xs mt-2">
              Es posible que el origen de tu aplicación no esté autorizado en Google Cloud.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}