import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../config/api';

// Lista de ejercicios predefinidos por categoría - se mantiene como referencia
const EJERCICIOS_POR_CATEGORIA = {
  'Pecho y Tríceps': [
    'Press de banca', 'Press inclinado', 'Press declinado', 'Aperturas con mancuernas', 
    'Fondos', 'Press francés', 'Extensiones de tríceps', 'Patada de tríceps'
  ],
  'Espalda y Bíceps': [
    'Dominadas', 'Remo', 'Jalón al pecho', 'Remo con mancuerna', 'Pullover',
    'Curl de bíceps', 'Curl martillo', 'Curl concentrado', 'Curl predicador'
  ],
  'Pierna': [
    'Sentadillas', 'Peso muerto', 'Prensa', 'Extensiones de cuádriceps', 'Curl femoral',
    'Elevaciones de gemelos', 'Hip thrust', 'Zancadas'
  ],
  'Hombros': [
    'Press militar', 'Elevaciones laterales', 'Elevaciones frontales', 'Remo al mentón',
    'Pájaros', 'Face pull'
  ],
  'Otros': [
    'Crunch abdominal', 'Plancha', 'Extensiones de espalda', 'Russian twist'
  ]
};

// Aplanar la lista para tener todos los ejercicios
const EJERCICIOS_PREDEFINIDOS = Object.values(EJERCICIOS_POR_CATEGORIA).flat();

const WorkoutForm = ({ onWorkoutAdded, existingWorkout }) => {
  const { token } = useAuth(); // Obtener el token de autenticación del contexto
  // useState con la fecha actual por defecto
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [exercises, setExercises] = useState([{ 
    name: '', 
    sets: 3, // Por defecto 3 series
    reps: 8, // Por defecto 8 repeticiones
    weight: 0, 
    notes: '' 
  }]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [customExercises, setCustomExercises] = useState([]);
  const [groupedExercises, setGroupedExercises] = useState({
    Personalizados: [],
    'Pecho y Tríceps': [],
    'Espalda y Bíceps': [],
    'Pierna': [],
    'Hombros': [],
    'Otros': []
  });
  // Ejercicios filtrados para mostrar en el selector
  const [filteredExercises, setFilteredExercises] = useState({
    Personalizados: [],
    'Pecho y Tríceps': [],
    'Espalda y Bíceps': [],
    'Pierna': [],
    'Hombros': [],
    'Otros': []
  });
  const [isLoadingExercises, setIsLoadingExercises] = useState(true);

  // Cargar ejercicios personalizados del usuario
  useEffect(() => {
    const fetchCustomExercises = async () => {
      if (!token) return;
      
      setIsLoadingExercises(true);
      try {
        const response = await axios.get(`${API_URL}/exercises`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Obtener ID del usuario actual
        const user = JSON.parse(localStorage.getItem('user'));
        
        // Filtrar ejercicios propios del usuario y organizarlos por grupo muscular
        const userExercises = response.data.filter(exercise => exercise.userId === user.id);
        
        // Organizar ejercicios personalizados por grupo muscular
        const personalizedByGroup = {};
        userExercises.forEach(exercise => {
          const groupName = exercise.muscleGroup.name;
          if (!personalizedByGroup[groupName]) {
            personalizedByGroup[groupName] = [];
          }
          personalizedByGroup[groupName].push(exercise.name);
        });
        
        // Agrupar ejercicios personalizados
        const newGroupedExercises = {
          Personalizados: userExercises.map(ex => ex.name),
          'Pecho y Tríceps': EJERCICIOS_POR_CATEGORIA['Pecho y Tríceps'],
          'Espalda y Bíceps': EJERCICIOS_POR_CATEGORIA['Espalda y Bíceps'],
          'Pierna': EJERCICIOS_POR_CATEGORIA['Pierna'],
          'Hombros': EJERCICIOS_POR_CATEGORIA['Hombros'],
          'Otros': EJERCICIOS_POR_CATEGORIA['Otros']
        };
        
        // Añadir ejercicios personalizados a cada categoría
        Object.keys(personalizedByGroup).forEach(groupName => {
          if (newGroupedExercises[groupName]) {
            // Si la categoría existe, añadir los ejercicios personalizados
            const existingExercises = new Set(newGroupedExercises[groupName]);
            personalizedByGroup[groupName].forEach(ex => existingExercises.add(ex));
            newGroupedExercises[groupName] = Array.from(existingExercises);
          }
        });
        
        setCustomExercises(userExercises);
        setGroupedExercises(newGroupedExercises);
        setFilteredExercises(newGroupedExercises); // Inicialmente mostrar todos
      } catch (error) {
        console.error('Error al cargar ejercicios personalizados:', error);
      } finally {
        setIsLoadingExercises(false);
      }
    };

    fetchCustomExercises();
  }, [token]);

  // Filtrar ejercicios cuando cambia la categoría seleccionada
  useEffect(() => {
    if (selectedCategory === '') {
      // Mostrar todos los ejercicios
      setFilteredExercises(groupedExercises);
    } else if (selectedCategory === 'Personalizados') {
      // Mostrar solo los ejercicios personalizados
      const filtered = {
        Personalizados: groupedExercises.Personalizados,
        'Pecho y Tríceps': [],
        'Espalda y Bíceps': [],
        'Pierna': [],
        'Hombros': [],
        'Otros': []
      };
      setFilteredExercises(filtered);
    } else {
      // Mostrar solo los ejercicios de la categoría seleccionada
      const filtered = {
        Personalizados: [], // No mostrar personalizados en categorías específicas
        'Pecho y Tríceps': selectedCategory === 'Pecho y Tríceps' ? groupedExercises['Pecho y Tríceps'] : [],
        'Espalda y Bíceps': selectedCategory === 'Espalda y Bíceps' ? groupedExercises['Espalda y Bíceps'] : [],
        'Pierna': selectedCategory === 'Pierna' ? groupedExercises['Pierna'] : [],
        'Hombros': selectedCategory === 'Hombros' ? groupedExercises['Hombros'] : [],
        'Otros': selectedCategory === 'Otros' ? groupedExercises['Otros'] : []
      };
      
      // Añadir ejercicios personalizados de esa categoría específica
      const personalizedInCategory = customExercises
        .filter(ex => ex.muscleGroup.name === selectedCategory)
        .map(ex => ex.name);
      
      if (personalizedInCategory.length > 0) {
        filtered.Personalizados = personalizedInCategory;
      }
      
      setFilteredExercises(filtered);
    }
  }, [selectedCategory, groupedExercises, customExercises]);

  // Si se proporciona un entrenamiento existente, cargar sus datos
  useEffect(() => {
    if (existingWorkout) {
      setDate(new Date(existingWorkout.date).toISOString().split('T')[0]);
      // Si el entrenamiento existente ya tiene ejercicios, los usamos
      if (existingWorkout.exercises && existingWorkout.exercises.length > 0) {
        setExercises(existingWorkout.exercises);
      }
    }
  }, [existingWorkout]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      let response;
      // Filtrar ejercicios vacíos y formatear correctamente los ejercicios
      const validExercises = exercises
        .filter(ex => ex.name.trim() !== '')
        .map(ex => ({
          name: ex.name,
          sets: parseInt(ex.sets) || 3,
          reps: parseInt(ex.reps) || 8,
          weight: parseFloat(ex.weight) || 0,
          notes: ex.notes || ''
        }));
      
      console.log('Ejercicios formateados:', validExercises);
      
      // Configuración de las cabeceras con el token de autenticación
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      
      // Si estamos editando un entrenamiento existente
      if (existingWorkout) {
        console.log('Añadiendo ejercicios al entrenamiento existente:', existingWorkout.id);
        
        // Añadir nuevos ejercicios al entrenamiento existente con el token
        response = await axios.post(
          `${API_URL}/workouts/${existingWorkout.id}/exercises`, 
          { exercises: validExercises },
          config
        );
      } else {
        console.log('Creando nuevo entrenamiento');
        
        // Crear un nuevo entrenamiento con el token
        const formattedDate = new Date().toISOString();
        response = await axios.post(
          `${API_URL}/workouts`, 
          {
            date: formattedDate,
            notes: '', 
            exercises: validExercises,
          },
          config
        );
      }

      setSuccess(true);
      setDate(new Date().toISOString().split('T')[0]);
      setExercises([{ name: '', sets: 3, reps: 8, weight: 0, notes: '' }]);
      
      // Notificar al padre que se ha añadido/actualizado un entrenamiento
      if (onWorkoutAdded) {
        onWorkoutAdded(response.data);
      }
      
      // Redirigir después de 1.5 segundos
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (error) {
      console.error('Error completo:', error);
      if (error.response) {
        console.error('Datos de respuesta del error:', error.response.data);
        console.error('Estado del error:', error.response.status);
      }
      setError(error.response?.data?.error || 'Error al guardar el entrenamiento');
      console.error('Error adding workout:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExerciseChange = (index, field, value) => {
    const updatedExercises = [...exercises];
    updatedExercises[index][field] = value;
    setExercises(updatedExercises);
  };

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: 3, reps: 8, weight: 0, notes: '' }]);
  };

  const removeExercise = (index) => {
    if (exercises.length === 1) {
      return; // Siempre mantener al menos un ejercicio
    }
    const updatedExercises = exercises.filter((_, i) => i !== index);
    setExercises(updatedExercises);
  };

  // Función para verificar si una categoría tiene ejercicios disponibles
  const hasExercisesInCategory = (category) => {
    return filteredExercises[category] && filteredExercises[category].length > 0;
  };

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <h1 className="section-title uppercase tracking-wider mb-12">
        {existingWorkout ? 'AÑADIR EJERCICIOS' : 'NUEVO ENTRENAMIENTO'}
      </h1>
      
      {success && (
        <div className="mb-8 p-4 border-l-4 border-black bg-gray-50 text-sm">
          {existingWorkout 
            ? 'Ejercicios añadidos con éxito. Redirigiendo...' 
            : 'Entrenamiento guardado con éxito. Redirigiendo...'}
        </div>
      )}
      
      {error && (
        <div className="mb-8 p-4 border-l-4 border-red-500 bg-red-50 text-sm text-red-800">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-10">

        <div>
          <div className="flex justify-between items-end mb-6 flex-col ">
            <div className="w-full max-w-xs">
              <label className="block text-sm uppercase tracking-wider mb-2 text-gray-500">
                Filtrar por grupo muscular
              </label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field w-full"
                disabled={isLoadingExercises}
              >
                <option value="">Todos los ejercicios</option>
                <option value="Personalizados">Personalizados</option>
                {Object.keys(EJERCICIOS_POR_CATEGORIA).map(categoria => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </select>
            </div>
            
            <button
              type="button"
              onClick={addExercise}
              className="btn-secondary flex items-center w-full md:w-auto mt-4 md:mt-0"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Añadir ejercicio
            </button>
          </div>
          
          <div className="space-y-6">
            {exercises.map((exercise, index) => (
              <div key={index} className="card relative group">
                <button 
                  type="button" 
                  onClick={() => removeExercise(index)}
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-black"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
                
                <p className="text-xs uppercase tracking-wider mb-6 text-gray-400">Ejercicio {index + 1}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm mb-2 text-gray-500">
                      Nombre del ejercicio
                    </label>
                    <select
                      value={exercise.name}
                      onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                      className="input-field"
                      disabled={isLoadingExercises}
                    >
                      <option value="">Selecciona un ejercicio</option>
                      
                      {/* Grupo de ejercicios personalizados */}
                      {hasExercisesInCategory('Personalizados') && (
                        <optgroup label="Personalizados">
                          {filteredExercises.Personalizados.map((ejercicio) => (
                            <option key={`personalizado-${ejercicio}`} value={ejercicio}>
                              {ejercicio}
                            </option>
                          ))}
                        </optgroup>
                      )}
                      
                      {/* Categorías predefinidas filtradas */}
                      {Object.entries(filteredExercises).map(([categoria, ejercicios]) => 
                        categoria !== 'Personalizados' && ejercicios.length > 0 ? (
                          <optgroup key={categoria} label={categoria}>
                            {ejercicios.map((ejercicio) => (
                              <option key={`${categoria}-${ejercicio}`} value={ejercicio}>
                                {ejercicio}
                              </option>
                            ))}
                          </optgroup>
                        ) : null
                      )}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm mb-2 text-gray-500">
                        Series
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={exercise.sets}
                        onChange={(e) => handleExerciseChange(index, 'sets', parseInt(e.target.value) || 3)}
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-2 text-gray-500">
                        Reps
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={exercise.reps}
                        onChange={(e) => handleExerciseChange(index, 'reps', parseInt(e.target.value) || 8)}
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-2 text-gray-500">
                        Peso (kg)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={exercise.weight}
                        onChange={(e) => handleExerciseChange(index, 'weight', parseFloat(e.target.value) || 0)}
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm mb-2 text-gray-500">
                    Notas del ejercicio
                  </label>
                  <textarea
                    value={exercise.notes}
                    onChange={(e) => handleExerciseChange(index, 'notes', e.target.value)}
                    className="input-field min-h-[80px] resize-none"
                    placeholder="Sensaciones, técnica, etc."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pt-6">
          <button
            type="submit"
            className="btn-primary w-full md:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? 'Guardando...' 
              : existingWorkout 
                ? 'Guardar ejercicios' 
                : 'Guardar entrenamiento'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkoutForm;