import { useState } from 'react'
import axios from 'axios'
import { API_URL } from '../config/api'

// Agregar un console.log para depurar el token recibido
export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const googleLogin = async (tokenResponse) => {
    setLoading(true)
    setError(null)

    try {
      // Verificar que se envíe el id_token al backend
      const idToken = tokenResponse.credential
      console.log('Token recibido de Google:', idToken) // Depurar el token recibido

      if (!idToken) {
        throw new Error('No se recibió un id_token válido de Google')
      }

      const response = await axios.post(`${API_URL}/auth/google`, {
        credential: idToken
      })

      setLoading(false)
      return response.data
    } catch (err) {
      setLoading(false)
      const errorMessage = err.response?.data?.error || 'Error al iniciar sesión con Google'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  return { googleLogin, loading, error }
}
