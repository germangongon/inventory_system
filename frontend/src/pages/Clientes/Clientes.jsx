import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'
import BotonVolver from '../../components/GoBackButton'

const Clientes = () => {
  const [clientes, setClientes] = useState([])
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    telefono: '',
    email: ''
  })
  const [mostrarForm, setMostrarForm] = useState(false)

  useEffect(() => {
    cargarClientes()
  }, [])

  const cargarClientes = async () => {
    try {
      const response = await api.get('/clientes/')
      setClientes(response.data)
    } catch (error) {
      console.error('Error cargando clientes:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/clientes/', nuevoCliente)
      cargarClientes()
      setNuevoCliente({ nombre: '', telefono: '', email: '' })
      setMostrarForm(false)
    } catch (error) {
      console.error('Error creando cliente:', error)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <BotonVolver/>
        <h1 className="text-2xl font-bold">Gestión de Clientes</h1>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          {mostrarForm ? 'Cancelar' : '+ Nuevo Cliente'}
        </button>
      </div>

      {mostrarForm && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Registrar Nuevo Cliente</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                value={nuevoCliente.nombre}
                onChange={(e) => setNuevoCliente({...nuevoCliente, nombre: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                className="w-full p-2 border rounded-lg"
                value={nuevoCliente.telefono}
                onChange={(e) => setNuevoCliente({...nuevoCliente, telefono: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Email (Opcional)</label>
              <input
                type="email"
                className="w-full p-2 border rounded-lg"
                value={nuevoCliente.email}
                onChange={(e) => setNuevoCliente({...nuevoCliente, email: e.target.value})}
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Guardar Cliente
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Nombre</th>
              <th className="px-6 py-3 text-left">Teléfono</th>
              <th className="px-6 py-3 text-left">Email</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{cliente.nombre}</td>
                <td className="px-6 py-4">{cliente.telefono}</td>
                <td className="px-6 py-4">{cliente.email || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Clientes