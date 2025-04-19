import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import useWorkouts from '../hooks/useWorkouts';
import axios from 'axios';
import { API_URL } from '../config/api';

const Home = () => {
  const { isAuthenticated, token } = useAuth();
  const { data: workouts } = useWorkouts();
  const [selectedExercise, setSelectedExercise] = useState('');
  const [availableExercises, setAvailableExercises] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userNames, setUserNames] = useState({});

  // Extraer todos los ejercicios únicos de los entrenamientos
  useEffect(() => {
    if (workouts && workouts.length > 0) {
      const exerciseSet = new Set();
      
      workouts.forEach(workout => {
        workout.exercises.forEach(exercise => {
          if (exercise.name) {
            exerciseSet.add(exercise.name);
          }
        });
      });
      
      const sortedExercises = Array.from(exerciseSet).sort();
      setAvailableExercises(sortedExercises);
      
      if (sortedExercises.length > 0 && !selectedExercise) {
        setSelectedExercise(sortedExercises[0]);
      }
    }
  }, [workouts, selectedExercise]);

  // Cargar usuarios para mostrar nombres en el ranking
  useEffect(() => {
    if (token && isAuthenticated) {
      axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        const usersMap = {};
        response.data.forEach(user => {
          usersMap[user.id] = user.name || user.email.split('@')[0];
        });
        setUserNames(usersMap);
      })
      .catch(error => {
        console.error('Error al cargar usuarios:', error);
      });
    }
  }, [token, isAuthenticated]);

  // Cargar ranking cuando cambia el ejercicio seleccionado
  useEffect(() => {
    if (selectedExercise && token) {
      setLoading(true);
      
      axios.get(`${API_URL}/stats/ranking?exercise=${encodeURIComponent(selectedExercise)}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setRanking(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al cargar ranking:', error);
        // Si el endpoint no existe, simular un ranking con datos locales
        if (workouts && workouts.length > 0) {
          const exerciseData = [];
          
          // Extraer y ordenar por peso máximo
          workouts.forEach(workout => {
            workout.exercises.forEach(exercise => {
              if (exercise.name === selectedExercise) {
                // Usar el ID del usuario actual como ejemplo
                const userId = JSON.parse(localStorage.getItem('user'))?.id;
                
                exerciseData.push({
                  userId: userId,
                  weight: exercise.weight,
                  date: workout.date
                });
              }
            });
          });
          
          // Ordenar por peso (mayor a menor)
          const sortedData = exerciseData.sort((a, b) => b.weight - a.weight);
          setRanking(sortedData);
        }
        
        setLoading(false);
      });
    }
  }, [selectedExercise, token, workouts]);

  // Conseguir la posición del usuario actual en el ranking
  const getCurrentUserPosition = () => {
    const userId = JSON.parse(localStorage.getItem('user'))?.id;
    if (!userId) return null;
    
    const position = ranking.findIndex(item => item.userId === userId) + 1;
    return position > 0 ? position : null;
  };

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-textPrimary">GymTracker</h1>
       
      </div>
      
      {!isAuthenticated ? (
        <div className="card p-8 mb-8 text-center">
          <h2 className="text-2xl font-medium mb-6">Bienvenido al reto gym</h2>
          <p className="text-textSecondary mb-6">
            Compite con tus amigos, compara pesos y celebra tus logros.
            ¡Inicia sesión y comienza a registrar tus entrenamientos!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="btn-primary">
              Iniciar sesión
            </Link>
            <Link to="/register" className="btn-secondary">
              Registrarse
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="card p-6 mb-8">
            <h2 className="text-xl font-medium mb-4 text-center">🏆 RANKING DE PESOS 🏆</h2>
            
            {availableExercises.length > 0 ? (
              <div className="mb-6">
                <label className="block text-sm uppercase tracking-wider mb-2 text-textSecondary">
                  Selecciona un ejercicio
                </label>
                <select
                  value={selectedExercise}
                  onChange={(e) => setSelectedExercise(e.target.value)}
                  className="input-field"
                >
                  {availableExercises.map((exercise) => (
                    <option key={exercise} value={exercise}>
                      {exercise}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p className="text-center text-textSecondary mb-4">
                No hay ejercicios disponibles. ¡Añade tu primer entrenamiento!
              </p>
            )}
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
              </div>
            ) : ranking.length > 0 ? (
              <>
                <div className="overflow-hidden rounded-lg bg-gray-800 shadow mb-4">
                  <table className="min-w-full">                    <thead>
                      <tr>
                        <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                          Posición
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                          Usuario
                        </th>
                        <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                          Peso (kg)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {ranking.map((entry, index) => {
                        const isCurrentUser = entry.userId === JSON.parse(localStorage.getItem('user'))?.id;
                        return (
                          <tr 
                            key={index} 
                            className={`${isCurrentUser ? 'bg-primary bg-opacity-20' : ''}`}
                          >
                            <td className="whitespace-nowrap py-3 px-4">
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}º`}
                            </td>
                            <td className="whitespace-nowrap py-3 px-4 font-medium">
                              {isCurrentUser ? (
                                <span className="font-bold text-primary">Tú</span>
                              ) : (
                                entry.name || userNames[entry.userId] || `Usuario ${entry.userId}`
                              )}
                            </td>
                            <td className="whitespace-nowrap py-3 px-4 font-bold text-primary">
                              {entry.weight} kg
                             
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                {getCurrentUserPosition() && (
                  <p className="text-center text-sm text-textSecondary">
                    Estás en posición #{getCurrentUserPosition()} en {selectedExercise}.
                    {getCurrentUserPosition() > 3 ? ' ¡Sigue entrenando para subir al podio!' : ' ¡Estás en el podio!'}
                  </p>
                )}
              </>
            ) : (
              <p className="text-center text-textSecondary py-4">
                No hay datos disponibles para este ejercicio.
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <Link 
              to="/" 
              className="card p-6 text-center hover:border-primary transition-colors"
            >
              <h3 className="text-lg font-medium mb-3">✏️ Mis Entrenamientos</h3>
              <p className="text-sm text-textSecondary">
                Ver y gestionar todos tus entrenamientos registrados.
              </p>
            </Link>
            <Link 
              to="/add" 
              className="card p-6 text-center hover:border-primary transition-colors"
            >
              <h3 className="text-lg font-medium mb-3">➕ Añadir Entrenamiento</h3>
              <p className="text-sm text-textSecondary">
                Registra un nuevo entrenamiento para competir en el ranking.
              </p>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
