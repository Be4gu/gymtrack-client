import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../config/api';
import WorkoutForm from './WorkoutForm';

const AddExercisesToWorkout = () => {
  const { id } = useParams();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const response = await axios.get(`${API_URL}/workouts/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWorkout(response.data);
        setLoading(false);
      } catch (err) {
        setError('No se pudo cargar el entrenamiento');
        setLoading(false);
      }
    };

    if (token) {
      fetchWorkout();
    } else {
      setError('Debes iniciar sesión para ver este contenido');
      setLoading(false);
    }
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error || !workout) {
    return (
      <div className="card p-6 my-8 border-l-4 border-red-500">
        <p className="text-textPrimary font-medium">{error || 'Entrenamiento no encontrado'}</p>
        <p className="text-sm mt-2">
          <a href="/" className="text-primary underline">Volver a la lista de entrenamientos</a>
        </p>
      </div>
    );
  }

  return <WorkoutForm existingWorkout={workout} onWorkoutAdded={() => window.location.href = '/'} />;
};

export default AddExercisesToWorkout;