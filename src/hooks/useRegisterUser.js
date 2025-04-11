import { useState } from 'react'
import axios from 'axios'
import { API_URL } from '../config/api'

export const useRegisterUser = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const registerUser = async (email, password, name) => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
        name
      })

      setLoading(false)
      return response.data
    } catch (err) {
      setLoading(false)
      const errorMessage = err.response?.data?.error || 'Error al registrar usuario'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  return { registerUser, loading, error }
}
