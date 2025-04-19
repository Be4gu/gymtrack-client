import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WorkoutList from './components/WorkoutList';
import WorkoutForm from './components/WorkoutForm';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Stats from './components/Stats';
import Profile from './components/Profile';
import AddExercisesToWorkout from './components/AddExercisesToWorkout';
import Home from './components/Home';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

// Aplicación de estilos globales y consistentes en App.jsx
function AppContent() {
  const { login, isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-dark text-textPrimary">
      <Navbar />
      <main className="container mx-auto px-6 max-w-6xl">
        <Routes>
          {/* Página Home disponible para todos */}
          <Route path="/home" element={<Home />} />
          
          {/* Rutas protegidas */}
          <Route path="/" element={
            <ProtectedRoute>
              <WorkoutList />
            </ProtectedRoute>
          } />
          <Route path="/add" element={
            <ProtectedRoute>
              <WorkoutForm onWorkoutAdded={() => window.location.href = '/'} />
            </ProtectedRoute>
          } />
          <Route path="/add-exercises/:id" element={
            <ProtectedRoute>
              <AddExercisesToWorkout />
            </ProtectedRoute>
          } />
          <Route path="/stats" element={
            <ProtectedRoute>
              <Stats />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          {/* Rutas para usuarios no autenticados */}
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" /> : (
              <div className="py-12">
                <LoginForm onLoginSuccess={(result) => {
                  login(result.user, result.token);
                  window.location.href = '/';
                }} />
              </div>
            )
          } />
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/" /> : (
              <div className="py-12">
                <RegisterForm onRegisterSuccess={(result) => {
                  login(result.user, result.token);
                  window.location.href = '/';
                }} />
              </div>
            )
          } />
          
          {/* Redirección por defecto a la página Home */}
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </main>
      <footer className="mt-auto py-3 border-t border-gray-700">
        <div className="container mx-auto px-2 text-center text-xs text-textSecondary flex flex-col items-center gap-1">
          <span className="font-bold text-primary text-base tracking-wide">GymTracker</span>
          <span className="text-xs text-textSecondary">Created by Entrellaves</span>
        </div>
      </footer>
    </div>
  );
}

// Componente para proteger rutas que requieren autenticación
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
