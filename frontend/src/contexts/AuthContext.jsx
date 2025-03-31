import { createContext, useContext, useEffect, useState } from 'react'
import jwtDecode from 'jwt-decode'
import api, { logout as apiLogout } from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Definir login correctamente
  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login/', { username, password })
      localStorage.setItem('access', response.data.access)
      localStorage.setItem('refresh', response.data.refresh)
  
      const decodedUser = jwtDecode(response.data.access)
      console.log("Usuario autenticado:", decodedUser) // Verificar qué contiene
  
      setUser(decodedUser) 
    } catch (error) {
      console.error('Error en login:', error.response?.data || error.message)
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('access')
        if (token) {
          setUser(jwtDecode(token))
        }
      } catch (error) {
        console.error('Error verificando token:', error)
        apiLogout()
      }
      setLoading(false)
    }
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout: apiLogout }}>
      {loading ? <p>Cargando...</p> : children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
