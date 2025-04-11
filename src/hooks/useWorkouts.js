import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import { API_URL } from '../config/api'

const useWorkouts = () => {
  const { token, isAuthenticated } = useAuth()

  return useQuery({
    queryKey: ['workouts'],
    queryFn: async () => {
      if (!isAuthenticated) {
        return []
      }

      const response = await axios.get(`${API_URL}/workouts`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log('Fetched workouts:', response.data)
      return response.data
    },
    enabled: !!token // Solo ejecutar la consulta si hay un token disponible
  })
}

export default useWorkouts
