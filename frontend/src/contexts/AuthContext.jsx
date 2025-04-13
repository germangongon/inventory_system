import { createContext, useContext, useEffect, useState } from 'react'
import jwtDecode from 'jwt-decode'
import api, { logout as apiLogout } from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const login = async (username, password) => {
    try {
      const response = await api.post('/auth/login/', { username, password })
      
      if (!response.data.access || !response.data.refresh) {
        throw new Error('Invalid response from server')
      }

      localStorage.setItem('access', response.data.access)
      localStorage.setItem('refresh', response.data.refresh)
  
      const decodedUser = jwtDecode(response.data.access)
      if (!decodedUser || !decodedUser.user_id) {
        throw new Error('Invalid token structure')
      }
      
      // Asegurarnos de que el usuario tenga un rol
      const userWithRole = {
        ...decodedUser,
        rol: decodedUser.rol || 'VENDEDOR' // Por defecto, asignamos el rol de vendedor
      }
      
      setUser(userWithRole)
      return userWithRole
    } catch (error) {
      console.error('Error en login:', error.response?.data || error.message)
      throw error
    }
  }

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('access')
      if (token) {
        const decodedUser = jwtDecode(token)
        // Verificar si el token ha expirado
        if (decodedUser.exp * 1000 < Date.now()) {
          throw new Error('Token expired')
        }
        // Asegurarnos de que el usuario tenga un rol
        const userWithRole = {
          ...decodedUser,
          rol: decodedUser.rol || 'VENDEDOR' // Por defecto, asignamos el rol de vendedor
        }
        console.log('Usuario decodificado:', userWithRole)
        setUser(userWithRole)
      }
    } catch (error) {
      console.error('Error verificando token:', error)
      apiLogout()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const logout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {loading ? <p>Cargando...</p> : children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
