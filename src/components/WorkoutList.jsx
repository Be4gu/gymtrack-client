import useWorkouts from '../hooks/useWorkouts';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const WorkoutList = () => {
  const { data: workouts, isLoading, isError } = useWorkouts();
  const [expandedWorkout, setExpandedWorkout] = useState(null);
  const navigate = useNavigate();

  const toggleExpand = (id) => {
    if (expandedWorkout === id) {
      setExpandedWorkout(null);
    } else {
      setExpandedWorkout(id);
    }
  };

  const goToAddExercises = (workout) => {
    navigate(`/add-exercises/${workout.id}`);
  };

  if (isLoading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent"></div>
    </div>
  );

  if (isError) return (
    <div className="my-8 p-6 border border-gray-700 bg-dark text-textPrimary">
      <p className="mb-2 font-medium">Error al cargar los entrenamientos.</p>
      <p className="text-sm text-textSecondary">Asegúrate de que el servidor backend esté en funcionamiento.</p>
    </div>
  );

  if (!workouts || workouts.length === 0) return (
    <div className="py-20 text-center max-w-md mx-auto">
      <h2 className="text-2xl font-light mb-4 text-textPrimary">Sin entrenamientos</h2>
      <p className="text-textSecondary mb-8">Comienza tu seguimiento añadiendo tu primer entrenamiento.</p>
      <Link 
        to="/add" 
        className="btn-primary inline-block bg-primary text-dark px-6 py-3 rounded hover:bg-secondary transition-all"
      >
        Añadir entrenamiento
      </Link>
    </div>
  );

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-12">
        <h1 className="section-title uppercase tracking-wider text-textPrimary">ENTRENAMIENTOS</h1>
        <Link 
          to="/add" 
          className="btn-primary bg-primary text-dark px-6 py-3 rounded hover:bg-secondary transition-all"
        >
          Añadir
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {workouts.map((workout) => (
          <div key={workout.id} className="card group bg-dark border border-gray-700 p-6 rounded-lg hover:shadow-lg transition-shadow">
            <div 
              className="cursor-pointer"
              onClick={() => toggleExpand(workout.id)}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-textPrimary">
                  {new Date(workout.date).toLocaleDateString('es', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </h3>
                <span className="text-sm text-textSecondary">
                  {workout.exercises?.length || 0} ejercicios
                </span>
              </div>

              <div className="h-px w-full bg-gray-700 mb-4"></div>

              {!expandedWorkout === workout.id && workout.exercises && workout.exercises.length > 0 && (
                <div className="text-sm text-textSecondary mb-6 line-clamp-1">
                  {workout.exercises.map(ex => ex.name).join(', ')}
                </div>
              )}
            </div>

            {expandedWorkout === workout.id && workout.exercises && workout.exercises.length > 0 && (
              <div className="pt-2">
                <div className="space-y-4">
                  {workout.exercises.map((exercise) => (
                    <div key={exercise.id} className="group/exercise">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-sm uppercase text-textPrimary">{exercise.name}</span>
                        <span className="text-sm bg-gray-800 px-2 py-1 rounded text-textPrimary">
                          {exercise.weight} kg
                        </span>
                      </div>
                      <div className="text-xs text-textSecondary mt-1">
                        {exercise.sets} series × {exercise.reps} repeticiones
                      </div>
                      {exercise.notes && (
                        <div className="text-xs italic text-gray-500 mt-1 truncate">
                          {exercise.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2 mt-6 pt-4 border-t border-gray-700">
              <button
                onClick={() => goToAddExercises(workout)}
                className="text-xs uppercase tracking-wider font-medium text-primary hover:text-secondary transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Añadir ejercicio
              </button>

              <button
                onClick={() => toggleExpand(workout.id)}
                className="text-xs uppercase tracking-wider font-medium text-primary hover:text-secondary transition-colors flex items-center ml-auto"
              >
                {expandedWorkout === workout.id ? 'Minimizar' : 'Ver detalles'}
                <svg 
                  className={`w-4 h-4 ml-1 transition-transform ${expandedWorkout === workout.id ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutList;