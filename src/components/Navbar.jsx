import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="py-4 px-6 bg-dark text-textPrimary border-b border-gray-700">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold tracking-tight text-primary">GYMTRACKER.</Link>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none text-textPrimary"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-8 font-light">
          {isAuthenticated ? (
            <>
              <Link to="/" className="hover:text-primary transition">ENTRENAMIENTOS</Link>
              <Link to="/add" className="hover:text-primary transition">AÑADIR</Link>
              <Link to="/stats" className="hover:text-primary transition">ESTADÍSTICAS</Link>
              <Link to="/profile" className="hover:text-primary transition">MI PERFIL</Link>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-textSecondary">{currentUser?.name || currentUser?.email}</span>
                <button 
                  onClick={handleLogout}
                  className="text-sm text-primary hover:underline"
                >
                  CERRAR SESIÓN
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-primary transition">INICIAR SESIÓN</Link>
              <Link to="/register" className="hover:text-primary transition">REGISTRARSE</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="lg:hidden mt-4 py-4 px-2 bg-dark border-t border-gray-700">
          {isAuthenticated ? (
            <>
              <Link to="/" 
                className="block py-3 hover:bg-gray-800 px-2 rounded text-textPrimary" 
                onClick={() => setIsOpen(false)}
              >
                ENTRENAMIENTOS
              </Link>
              <Link to="/add" 
                className="block py-3 hover:bg-gray-800 px-2 rounded text-textPrimary" 
                onClick={() => setIsOpen(false)}
              >
                AÑADIR
              </Link>
              <Link to="/stats" 
                className="block py-3 hover:bg-gray-800 px-2 rounded text-textPrimary" 
                onClick={() => setIsOpen(false)}
              >
                ESTADÍSTICAS
              </Link>
              <Link to="/profile" 
                className="block py-3 hover:bg-gray-800 px-2 rounded text-textPrimary" 
                onClick={() => setIsOpen(false)}
              >
                MI PERFIL
              </Link>
              <div className="py-3 px-2 flex justify-between items-center">
                <span className="text-sm text-textSecondary">{currentUser?.name || currentUser?.email}</span>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="text-sm text-primary hover:underline"
                >
                  CERRAR SESIÓN
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" 
                className="block py-3 hover:bg-gray-800 px-2 rounded text-textPrimary" 
                onClick={() => setIsOpen(false)}
              >
                INICIAR SESIÓN
              </Link>
              <Link to="/register" 
                className="block py-3 hover:bg-gray-800 px-2 rounded text-textPrimary" 
                onClick={() => setIsOpen(false)}
              >
                REGISTRARSE
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;