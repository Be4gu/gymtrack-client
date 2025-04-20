// Selecciona la URL del backend según el entorno
const API_URL = import.meta.env.MODE === 'production' ? 'https://gymtracker-api.vercel.app' : 'http://localhost:3000'

// URL del frontend según el entorno
const FRONTEND_URL = import.meta.env.MODE === 'production' ? 'https://gymtrack-client.vercel.app' : 'http://localhost:5173'

export { API_URL, FRONTEND_URL }
