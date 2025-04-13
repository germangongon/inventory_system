import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'
import BotonVolver from '../../components/GoBackButton'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { PlusIcon } from '@heroicons/react/24/outline'

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    dni: '',
    phone: '',
    address: ''
  })
  const [showForm, setShowForm] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      const response = await api.get('/customers/')
      setCustomers(response.data)
    } catch (error) {
      console.error('Error loading customers:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCustomer) {
        await api.put(`/customers/${editingCustomer.id}/`, newCustomer)
      } else {
        await api.post('/customers/', newCustomer)
      }
      loadCustomers()
      setNewCustomer({ name: '', dni: '', phone: '', address: '' })
      setShowForm(false)
      setEditingCustomer(null)
    } catch (error) {
      console.error('Error saving customer:', error)
    }
  }

  const handleEdit = (customer) => {
    setEditingCustomer(customer)
    setNewCustomer({
      name: customer.name,
      dni: customer.dni,
      phone: customer.phone,
      address: customer.address
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      try {
        await api.delete(`/customers/${id}/`)
        loadCustomers()
      } catch (error) {
        console.error('Error deleting customer:', error)
      }
    }
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.dni.includes(searchTerm) ||
    (customer.address && customer.address.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="p-6 bg-white shadow rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <BotonVolver />
        <h1 className="text-2xl font-bold">Gestión de Clientes</h1>
        <Link 
          to="/customers/new" 
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-md transition-all duration-200"
        >
          <PlusIcon className="w-5 h-5" />
          Agregar Cliente
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar clientes..."
          className="w-full p-2 border rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingCustomer ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">DNI</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                value={newCustomer.dni}
                onChange={(e) => setNewCustomer({...newCustomer, dni: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Teléfono</label>
              <input
                type="tel"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Dirección</label>
              <textarea
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                value={newCustomer.address}
                onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                rows="3"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-md transition-all duration-200"
              >
                {editingCustomer ? 'Actualizar' : 'Guardar'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingCustomer(null)
                  setNewCustomer({ name: '', dni: '', phone: '', address: '' })
                }}
                className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-md transition-all duration-200"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Nombre</th>
              <th className="px-6 py-3 text-left">DNI</th>
              <th className="px-6 py-3 text-left">Teléfono</th>
              <th className="px-6 py-3 text-left">Dirección</th>
              <th className="px-6 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{customer.name}</td>
                <td className="px-6 py-4">{customer.dni}</td>
                <td className="px-6 py-4">{customer.phone}</td>
                <td className="px-6 py-4">{customer.address || '-'}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(customer)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(customer.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Customers