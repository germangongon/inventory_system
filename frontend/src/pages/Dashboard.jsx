import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import SalesChart from '../components/SalesChart'
import RecentSales from '../components/RecentSales'
import LowStockItems from '../components/LowStockItems'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalSales: 0,
    lowStockItems: 0,
    recentSales: [],
    salesData: []
  })

  useEffect(() => {
    console.log('Usuario en Dashboard:', user)
    const fetchData = async () => {
      try {
        const [salesRes, productsRes] = await Promise.all([
          api.get('/sales/'),
          api.get('/products/')
        ])
        
        const lowStock = productsRes.data.filter(p => p.stock < 10).length
        const salesData = processSalesData(salesRes.data)
        
        setStats({
          totalSales: salesRes.data.length,
          lowStockItems: lowStock,
          recentSales: salesRes.data.slice(0, 5),
          salesData
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      }
    }
    
    fetchData()
  }, [])

  const processSalesData = (sales) => {
    const dailySales = sales.reduce((acc, sale) => {
      const date = new Date(sale.date).toLocaleDateString()
      acc[date] = (acc[date] || 0) + parseFloat(sale.total)
      return acc
    }, {})
    
    return Object.entries(dailySales).map(([date, total]) => ({
      date,
      total
    }))
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Ventas Totales</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalSales}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Productos con Stock Bajo</h3>
          <p className="text-3xl font-bold text-red-600">{stats.lowStockItems}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Usuario</h3>
          <div className="space-y-2">
            <p className="text-xl text-gray-700">{user?.username}</p>
            <p className="text-sm text-gray-500">Rol: {user?.rol}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart data={stats.salesData} />
        <RecentSales sales={stats.recentSales} />
      </div>

      <LowStockItems />
    </div>
  )
}

export default Dashboard 