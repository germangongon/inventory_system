import { useState, useEffect } from 'react'
import api from '../../services/api'
import { format } from 'date-fns'

const SalesHistory = () => {
  const [ventas, setVentas] = useState([])
  const [filtro, setFiltro] = useState({
    fechaInicio: '',
    fechaFin: ''
  })

  useEffect(() => {
    cargarVentas()
  }, [filtro])

  const cargarVentas = async () => {
    try {
      const params = {
        fecha__gte: filtro.fechaInicio,
        fecha__lte: filtro.fechaFin
      }
      const response = await api.get('/ventas/', { params })
      setVentas(response.data)
    } catch (error) {
      console.error('Error cargando ventas:', error)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex gap-4 items-center">
        <input
          type="date"
          className="p-2 border rounded"
          onChange={(e) => setFiltro({...filtro, fechaInicio: e.target.value})}
        />
        <input
          type="date"
          className="p-2 border rounded"
          onChange={(e) => setFiltro({...filtro, fechaFin: e.target.value})}
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Fecha</th>
              <th className="px-6 py-3 text-left">Cliente</th>
              <th className="px-6 py-3 text-left">Vendedor</th>
              <th className="px-6 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map(venta => (
              <tr key={venta.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  {format(new Date(venta.fecha), 'dd/MM/yyyy HH:mm')}
                </td>
                <td className="px-6 py-4">{venta.cliente.nombre}</td>
                <td className="px-6 py-4">{venta.vendedor.username}</td>
                <td className="px-6 py-4 text-right font-medium">
                  ${venta.total}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SalesHistory