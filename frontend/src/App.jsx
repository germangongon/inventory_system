import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CreateSale from './pages/Ventas/CreateSale'
import Clientes from './pages/Clientes/Clientes'
import Productos from './components/Products'
import ProductoForm from './components/Products.Form'

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth()
  
  if (!user) return <Navigate to="/login" />
  if (roles && !roles.includes(user.rol)) return <Navigate to="/" />
  
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/ventas/nueva" element={<ProtectedRoute roles={['VENDEDOR', 'ADMIN']}><CreateSale /></ProtectedRoute>} />
        <Route path="/clientes" element={<ProtectedRoute roles={['ADMIN']}><Clientes /></ProtectedRoute>} />
        <Route path="/productos" element={<ProtectedRoute roles={['ADMIN']}><Productos /></ProtectedRoute>} />
        <Route path="/productos/nuevo" element={<ProtectedRoute roles={['ADMIN']}><ProductoForm /></ProtectedRoute>} />
        <Route path="/productos/editar/:id" element={<ProtectedRoute roles={['ADMIN']}><ProductoForm /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App