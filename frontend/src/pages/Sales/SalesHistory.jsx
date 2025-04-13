import { useState, useEffect } from 'react'
import api from '../../services/api'
import { format } from 'date-fns'

const SalesHistory = () => {
  const [sales, setSales] = useState([])
  const [filter, setFilter] = useState({
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    loadSales()
  }, [filter])

  const loadSales = async () => {
    try {
      const params = {
        date__gte: filter.startDate,
        date__lte: filter.endDate
      }
      const response = await api.get('/sales/', { params })
      setSales(response.data)
    } catch (error) {
      console.error('Error loading sales:', error)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex gap-4 items-center">
        <input
          type="date"
          className="p-2 border rounded"
          onChange={(e) => setFilter({...filter, startDate: e.target.value})}
        />
        <input
          type="date"
          className="p-2 border rounded"
          onChange={(e) => setFilter({...filter, endDate: e.target.value})}
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Customer</th>
              <th className="px-6 py-3 text-left">Seller</th>
              <th className="px-6 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(sale => (
              <tr key={sale.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  {format(new Date(sale.date), 'dd/MM/yyyy HH:mm')}
                </td>
                <td className="px-6 py-4">{sale.customer_info?.name}</td>
                <td className="px-6 py-4">{sale.seller?.username}</td>
                <td className="px-6 py-4 text-right font-medium">
                  ${sale.total}
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