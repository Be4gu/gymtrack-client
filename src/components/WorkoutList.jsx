import useWorkouts from '../hooks/useWorkouts';
import { useDeleteWorkout } from '../hooks/useDeleteWorkout';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const WorkoutList = () => {
  const { data: workouts, isLoading, isError } = useWorkouts();
  const { deleteWorkout, isDeleting } = useDeleteWorkout();
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
      <div className="flex flex-col justify-between items-center mb-12">
        <h1 className="section-title uppercase tracking-wider text-textPrimary">ENTRENAMIENTOS</h1>
        <Link 
          to="/add" 
          className="btn-primary bg-primary text-dark px-6 py-3 rounded hover:bg-secondary transition-all"
        >
          Añadir
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 overflow-x-auto">
        {workouts.map((workout) => (
          <div key={workout.id} className="card group bg-dark border border-gray-700 p-4 rounded-lg hover:shadow-lg transition-shadow w-full max-w-full">
            <div 
              className="cursor-pointer"
              onClick={() => toggleExpand(workout.id)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-textPrimary">
                    {new Date(workout.date).toLocaleDateString('es', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </h3>
                </div>
                <span className="text-sm text-textSecondary">
                  {workout.exercises?.length || 0} ejercicios
                </span>
              </div>

              <div className="h-px w-full bg-gray-700 mb-4"></div>

              {expandedWorkout !== workout.id && workout.exercises && workout.exercises.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {workout.exercises.slice(0, 3).map((ex, i) => (
                    <span key={i} className="inline-block bg-gray-800 text-xs text-textSecondary px-2 py-1 rounded-full">
                      {ex.name}
                    </span>
                  ))}
                  {workout.exercises.length > 3 && (
                    <span className="inline-block bg-gray-800 text-xs text-textSecondary px-2 py-1 rounded-full">+{workout.exercises.length - 3} más</span>
                  )}
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
            )}            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-6 justify-between pt-4 border-t border-gray-700">
              <div className="flex w-full gap-2">
                <button
                  onClick={() => goToAddExercises(workout)}
                  className="w-full sm:w-auto text-xs uppercase tracking-wider font-medium text-primary hover:text-secondary transition-colors flex items-center justify-center py-3 rounded-lg border border-primary"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Añadir ejercicio
                </button>
                <button
                  onClick={async () => {
                    try {
                      await deleteWorkout(workout.id);
                    } catch (error) {
                      console.error('Error al eliminar entrenamiento:', error);
                    }
                  }}
                  className="w-full sm:w-auto text-xs uppercase tracking-wider font-medium text-red-500 hover:text-red-400 transition-colors flex items-center justify-center py-3 rounded-lg border border-red-500"
                  disabled={isDeleting}
                  aria-label="Eliminar entrenamiento"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Eliminar
                </button>
              </div>
              <button
                onClick={() => toggleExpand(workout.id)}
                className="w-full sm:w-auto text-xs uppercase tracking-wider font-medium text-primary hover:text-secondary transition-colors flex items-center justify-center py-3 rounded-lg border border-primary mt-2 sm:mt-0"
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