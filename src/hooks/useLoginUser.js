import { useState } from 'react'
import axios from 'axios'
import { API_URL } from '../config/api'

export const useLoginUser = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loginUser = async (email, password) => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      })

      setLoading(false)
      return response.data
    } catch (err) {
      setLoading(false)
      const errorMessage = err.response?.data?.error || 'Error al iniciar sesión'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  return { loginUser, loading, error }
}
