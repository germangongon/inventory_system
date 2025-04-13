import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
})

// Interceptor para añadir token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access')
  console.log('Token:', token); // Verifica que el token sea válido
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Función para refrescar el token
const refreshToken = async () => {
  try {
    const response = await axios.post(`${api.defaults.baseURL}/auth/refresh/`, {
      refresh: localStorage.getItem('refresh')
    })
    localStorage.setItem('access', response.data.access)
    return response.data.access
  } catch (error) {
    logout()
    throw error
  }
}

// Manejo de errores
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const newToken = await refreshToken()
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Función de logout global
export const logout = () => {
  localStorage.removeItem('access')
  localStorage.removeItem('refresh')
  window.location.href = '/login' // Redirige al login
}

// Funciones para manejar productos
export const getProducts = async () => {
  const response = await api.get('/products/')
  return response.data
}

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}/`)
  return response.data
}

export const createProduct = async (product) => {
  const response = await api.post('/products/', product)
  return response.data
}

export const updateProduct = async (id, product) => {
  const response = await api.put(`/products/${id}/`, product)
  return response.data
}

export const deleteProduct = async (id) => {
  await api.delete(`/products/${id}/`)
}

export default api
