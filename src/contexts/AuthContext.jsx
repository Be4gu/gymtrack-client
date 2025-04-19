import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [authProvider, setAuthProvider] = useState(null); // 'google' o 'email'

  // Cargar el usuario desde localStorage al iniciar la aplicación
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    const storedProvider = localStorage.getItem('authProvider');
    
    if (storedUser && storedToken) {
      setCurrentUser(JSON.parse(storedUser));
      setToken(storedToken);
      setAuthProvider(storedProvider || 'email'); // Por defecto, asumimos email
    }
    
    setLoading(false);
  }, []);

  // Función para iniciar sesión
  const login = (userData, authToken, provider = 'email') => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
    localStorage.setItem('authProvider', provider);
    setCurrentUser(userData);
    setToken(authToken);
    setAuthProvider(provider);
  };

  // Función para iniciar sesión con Google
  const googleLogin = (userData, authToken) => {
    login(userData, authToken, 'google');
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('authProvider');
    setCurrentUser(null);
    setToken(null);
    setAuthProvider(null);
  };
  const value = {
    currentUser,
    token,
    login,
    googleLogin,
    logout,
    isAuthenticated: !!currentUser,
    authProvider,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};