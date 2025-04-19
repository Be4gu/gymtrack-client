import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../config/api';
import ExerciseCreator from './ExerciseCreator';

const Profile = () => {
  const { token, currentUser } = useAuth();
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showExerciseCreator, setShowExerciseCreator] = useState(false);

  // Cargar grupos musculares al iniciar
  useEffect(() => {
    const fetchMuscleGroups = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/muscle-groups`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMuscleGroups(response.data);
        
        if (response.data.length > 0) {
          setSelectedGroup(response.data[0].id);
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error al cargar grupos musculares:', err);
        setError('Error al cargar grupos musculares');
        setIsLoading(false);
      }
    };

    if (token) {
      fetchMuscleGroups();
    }
  }, [token]);

  // Cargar ejercicios cuando cambia el grupo muscular seleccionado
  useEffect(() => {
    const fetchExercises = async () => {
      if (!selectedGroup) return;
      
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/exercises?muscleGroupId=${selectedGroup}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setExercises(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error al cargar ejercicios:', err);
        setError('Error al cargar ejercicios');
        setIsLoading(false);
      }
    };

    if (token && selectedGroup) {
      fetchExercises();
    }
  }, [token, selectedGroup]);

  // Función para añadir un nuevo ejercicio
  const handleAddExercise = async (newExercise) => {
    try {
      await axios.post(`${API_URL}/exercises`, newExercise, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Recargar ejercicios del grupo actual
      const response = await axios.get(`${API_URL}/exercises?muscleGroupId=${selectedGroup}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExercises(response.data);
      setShowExerciseCreator(false);
    } catch (err) {
      console.error('Error al crear ejercicio:', err);
      setError('Error al crear ejercicio');
    }
  };

  if (isLoading && muscleGroups.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <h1 className="section-title uppercase tracking-wider">MI PERFIL</h1>
        <button
          onClick={() => setShowExerciseCreator(true)}
          className="btn-primary"
        >
          Crear ejercicio
        </button>
      </div>

      {error && (
        <div className="card p-4 mb-8 border-l-4 border-red-500">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div className="card mb-8 w-full max-w-full p-4 sm:p-6">
        <h2 className="text-lg font-medium mb-4">Datos personales</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <span className="text-sm text-textSecondary">Email:</span>
            <p className="text-textPrimary break-all">{currentUser?.email}</p>
          </div>
          <div>
            <span className="text-sm text-textSecondary">Nombre:</span>
            <p className="text-textPrimary">{currentUser?.name || 'No especificado'}</p>
          </div>
        </div>
      </div>

      <div className="card w-full max-w-full">
        <h2 className="text-lg font-medium mb-6">Mis ejercicios</h2>
        <div className="mb-8">
          <label className="block text-sm uppercase tracking-wider mb-2 text-textSecondary">
            Selecciona grupo muscular
          </label>
          <select
            value={selectedGroup || ''}
            onChange={(e) => setSelectedGroup(Number(e.target.value))}
            className="input-field max-w-full"
          >
            {muscleGroups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name} {group.isPublic ? '(Público)' : ''}
              </option>
            ))}
          </select>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent"></div>
          </div>
        ) : exercises.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {exercises.map((exercise) => (
              <div key={exercise.id} className="p-4 bg-gray-800 rounded">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-textPrimary">{exercise.name}</h3>
                  <span className="text-xs bg-gray-700 px-2 py-1 rounded-full text-textSecondary">
                    {exercise.isPublic ? 'Público' : 'Privado'}
                  </span>
                </div>
                <p className="text-sm text-textSecondary mt-1">
                  Grupo: {exercise.muscleGroup.name}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-textSecondary py-8">
            No hay ejercicios en este grupo muscular.
          </p>
        )}
      </div>

      {/* Modal para crear ejercicio */}
      {showExerciseCreator && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center p-2">
          <div className="bg-dark border border-gray-700 rounded-lg p-4 w-full max-w-sm mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">Crear ejercicio</h2>
              <button 
                onClick={() => setShowExerciseCreator(false)}
                className="text-textSecondary hover:text-textPrimary"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <ExerciseCreator 
              muscleGroups={muscleGroups} 
              onSave={handleAddExercise} 
              onCancel={() => setShowExerciseCreator(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
