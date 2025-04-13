import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CreateSale from './pages/Sales/CreateSale'
import Customers from './pages/Customers/Customers'
import Products from './components/Products'
import ProductForm from './components/Products.Form'
import Navbar from './components/Navbar'

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth()
  
  if (!user) return <Navigate to="/login" />
  if (roles && !roles.includes(user.rol)) return <Navigate to="/" />
  
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/sales/new" element={<ProtectedRoute roles={['VENDEDOR', 'ADMIN']}><CreateSale /></ProtectedRoute>} />
        <Route path="/customers" element={<ProtectedRoute roles={['ADMIN']}><Customers /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute roles={['ADMIN']}><Products /></ProtectedRoute>} />
        <Route path="/products/new" element={<ProtectedRoute roles={['ADMIN']}><ProductForm /></ProtectedRoute>} />
        <Route path="/products/edit/:id" element={<ProtectedRoute roles={['ADMIN']}><ProductForm /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App