// filepath: e:\gym\src\hooks\useDeleteWorkout.js
import { useState } from 'react'
import axios from 'axios'
import { API_URL } from '../config/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useDeleteWorkout = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const queryClient = useQueryClient()

  const deleteWorkoutMutation = useMutation({
    mutationFn: async (workoutId) => {
      setLoading(true)
      setError(null)

      try {
        const token = localStorage.getItem('token')

        if (!token) {
          throw new Error('No hay sesión activa')
        }

        await axios.delete(`${API_URL}/workouts/${workoutId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        setLoading(false)
        return true
      } catch (err) {
        setLoading(false)
        const errorMessage = err.response?.data?.error || 'Error al eliminar el entrenamiento'
        setError(errorMessage)
        throw new Error(errorMessage)
      }
    },
    onSuccess: () => {
      // Invalidar la caché para forzar una recarga de los entrenamientos
      queryClient.invalidateQueries({ queryKey: ['workouts'] })
    }
  })

  const deleteWorkout = async (workoutId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este entrenamiento? Esta acción no se puede deshacer.')) {
      return false
    }

    return deleteWorkoutMutation.mutateAsync(workoutId)
  }

  return {
    deleteWorkout,
    loading,
    error,
    isDeleting: deleteWorkoutMutation.isPending
  }
}
