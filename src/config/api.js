// Selecciona la URL del backend según la variable de entorno VITE_API_URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
export { API_URL }
