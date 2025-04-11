import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import WorkoutList from './components/WorkoutList';
import WorkoutForm from './components/WorkoutForm';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Stats from './components/Stats';
import Profile from './components/Profile';
import AddExercisesToWorkout from './components/AddExercisesToWorkout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { API_URL } from './config/api';
import './App.css';

// Aplicación de estilos globales y consistentes en App.jsx
function AppContent() {
  const { login } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-dark text-textPrimary">
      <Navbar />
      <main className="container mx-auto px-6 max-w-6xl">
        <Routes>
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
          <Route path="/login" element={
            <div className="py-12">
              <LoginForm onLoginSuccess={(result) => {
                login(result.user, result.token);
                window.location.href = '/';
              }} />
            </div>
          } />
          <Route path="/register" element={
            <div className="py-12">
              <RegisterForm onRegisterSuccess={(result) => {
                login(result.user, result.token);
                window.location.href = '/';
              }} />
            </div>
          } />
        </Routes>
      </main>
      <footer className="mt-auto py-6 border-t border-gray-700">
        <div className="container mx-auto px-6 text-center text-sm text-textSecondary">
          GymTracker © {new Date().getFullYear()} • Diseñado con estilo minimalista
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
