import { useState, useEffect } from 'react';
import useWorkouts from '../hooks/useWorkouts';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const Stats = () => {
  const { data: workouts, isLoading, isError } = useWorkouts();
  const [chartData, setChartData] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [availableExercises, setAvailableExercises] = useState([]);

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
      
      // Seleccionar automáticamente el primer ejercicio si no hay uno seleccionado
      if (sortedExercises.length > 0 && !selectedExercise) {
        setSelectedExercise(sortedExercises[0]);
      }
    }
  }, [workouts, selectedExercise]);

  // Actualizar datos del gráfico cuando se cambia el ejercicio seleccionado
  useEffect(() => {
    if (workouts && workouts.length > 0 && selectedExercise) {
      // Filtrar los entrenamientos que contienen el ejercicio seleccionado
      const relevantWorkouts = workouts
        .filter(workout => 
          workout.exercises.some(ex => ex.name === selectedExercise)
        )
        .sort((a, b) => new Date(a.date) - new Date(b.date)); // Ordenar de más antiguo a más reciente
      
      if (relevantWorkouts.length > 0) {
        // Extraer fechas y pesos para el ejercicio seleccionado
        const dates = relevantWorkouts.map(workout => 
          new Date(workout.date).toLocaleDateString('es', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })
        );
        
        const weights = relevantWorkouts.map(workout => {
          const exercise = workout.exercises.find(ex => ex.name === selectedExercise);
          return exercise ? exercise.weight : 0;
        });

        setChartData({
          labels: dates,
          datasets: [
            {
              label: `Progreso de peso para ${selectedExercise}`,
              data: weights,
              borderColor: '#4F46E5',
              backgroundColor: 'rgba(79, 70, 229, 0.2)',
              fill: true,
              tension: 0.1
            },
          ],
        });
      } else {
        setChartData(null);
      }
    } else {
      setChartData(null);
    }
  }, [workouts, selectedExercise]);

  if (isLoading) return <div className="text-center py-20">Cargando estadísticas...</div>;
  if (isError) return <div className="text-center py-20">Error al cargar las estadísticas.</div>;

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <h1 className="section-title uppercase tracking-wider mb-8">Estadísticas</h1>
      
      {availableExercises.length > 0 ? (
        <>
          <div className="mb-8">
            <label className="block text-sm uppercase tracking-wider mb-2 text-textSecondary">
              Selecciona un ejercicio
            </label>
            <select
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
              className="input-field max-w-xs"
            >
              {availableExercises.map((exercise) => (
                <option key={exercise} value={exercise}>
                  {exercise}
                </option>
              ))}
            </select>
          </div>
          
          {chartData ? (
            <div className="card p-6">
              <h2 className="text-lg font-medium mb-4 text-textPrimary">
                Progreso de {selectedExercise}
              </h2>
              <div style={{ height: '400px' }}>
                <Line 
                  data={chartData} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: {
                          display: true,
                          text: 'Peso (kg)',
                          color: '#9CA3AF'
                        },
                        grid: {
                          color: 'rgba(71, 85, 105, 0.2)'
                        },
                        ticks: {
                          color: '#9CA3AF'
                        }
                      },
                      x: {
                        grid: {
                          color: 'rgba(71, 85, 105, 0.2)'
                        },
                        ticks: {
                          color: '#9CA3AF'
                        }
                      }
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `${context.parsed.y} kg`;
                          }
                        }
                      },
                      legend: {
                        labels: {
                          color: '#E5E7EB'
                        }
                      }
                    }
                  }} 
                />
              </div>
            </div>
          ) : (
            <div className="card p-8 text-center">
              <p className="text-textSecondary">No hay datos disponibles para mostrar el progreso de {selectedExercise}.</p>
            </div>
          )}
        </>
      ) : (
        <div className="card p-8 text-center">
          <p className="text-textSecondary mb-4">No hay suficientes datos para mostrar estadísticas.</p>
          <p className="text-sm text-textSecondary">Añade algunos entrenamientos para ver tu progreso.</p>
        </div>
      )}
    </div>
  );
};

export default Stats;