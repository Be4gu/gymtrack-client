import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/home');
  };

  return (
    <nav className="py-3 px-2 bg-dark text-textPrimary border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/home" className="text-xl font-semibold tracking-tight text-primary">GYMTRACKER.</Link>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none text-textPrimary p-2 rounded hover:bg-gray-800"
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <Link to="/home" className="hover:text-primary transition">INICIO</Link>
          {isAuthenticated ? (
            <>
              <Link to="/" className="hover:text-primary transition">ENTRENAMIENTOS</Link>
              <Link to="/add" className="hover:text-primary transition">AÑADIR</Link>
              <Link to="/stats" className="hover:text-primary transition">ESTADÍSTICAS</Link>
              <Link to="/profile" className="hover:text-primary transition">MI PERFIL</Link>
              <div className="flex items-center space-x-4">
                {/* <span className="text-sm text-textSecondary">{currentUser?.name || currentUser?.email}</span> */}
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
      </div>      {/* Mobile Dropdown Menu - Fixed Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="w-full max-w-xs mx-auto bg-dark border border-gray-700 rounded-xl shadow-xl p-4 animate-fadeIn">
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
              <span className="text-lg font-semibold text-primary">GYMTRACKER.</span>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-textSecondary hover:text-textPrimary"
                aria-label="Cerrar menú"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-1">
              <Link to="/home" 
                className="py-3 hover:bg-gray-800 px-3 rounded-lg text-textPrimary text-center font-medium" 
                onClick={() => setIsOpen(false)}
              >
                INICIO
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/" 
                    className="py-3 hover:bg-gray-800 px-3 rounded-lg text-textPrimary text-center font-medium" 
                    onClick={() => setIsOpen(false)}
                  >
                    ENTRENAMIENTOS
                  </Link>
                  <Link to="/add" 
                    className="py-3 hover:bg-gray-800 px-3 rounded-lg text-textPrimary text-center font-medium" 
                    onClick={() => setIsOpen(false)}
                  >
                    AÑADIR
                  </Link>
                  <Link to="/stats" 
                    className="py-3 hover:bg-gray-800 px-3 rounded-lg text-textPrimary text-center font-medium" 
                    onClick={() => setIsOpen(false)}
                  >
                    ESTADÍSTICAS
                  </Link>
                  <Link to="/profile" 
                    className="py-3 hover:bg-gray-800 px-3 rounded-lg text-textPrimary text-center font-medium" 
                    onClick={() => setIsOpen(false)}
                  >
                    MI PERFIL
                  </Link>
                  <div className="border-t border-gray-700 my-2"></div>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="py-3 text-primary hover:underline text-center font-medium"
                  >
                    CERRAR SESIÓN
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" 
                    className="py-3 hover:bg-gray-800 px-3 rounded-lg text-textPrimary text-center font-medium" 
                    onClick={() => setIsOpen(false)}
                  >
                    INICIAR SESIÓN
                  </Link>
                  <Link to="/register" 
                    className="py-3 hover:bg-gray-800 px-3 rounded-lg text-textPrimary text-center font-medium" 
                    onClick={() => setIsOpen(false)}
                  >
                    REGISTRARSE
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;