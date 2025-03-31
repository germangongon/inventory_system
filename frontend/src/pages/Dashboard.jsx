import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import api from '../services/api'
import SalesChart from '../components/SalesChart'
import RecentSales from '../components/RecentSales'
import LowStockItems from '../components/LowStockItems'
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  ArrowRightEndOnRectangleIcon
} from '@heroicons/react/24/outline'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const [stats, setStats] = useState({
    totalSales: 0,
    lowStockItems: 0,
    recentSales: [],
    salesData: []
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, productsRes] = await Promise.all([
          api.get('/ventas/'),
          api.get('/productos/')
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
      const date = new Date(sale.fecha).toLocaleDateString()
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Panel Principal</h1>
        <div className="flex gap-4">
          <Link
            to="/ventas/nueva"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            <CurrencyDollarIcon className="w-5 h-5" />
            Nueva Venta
          </Link>
          <Link
            to="/clientes"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            <UserGroupIcon className="w-5 h-5" />
            Ver Clientes
          </Link>
           {/* Botón de agregar producto */}
           <Link
            to="/productos/nuevo"
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
          >
            <ShoppingCartIcon className="w-5 h-5" />
            Agregar Producto
          </Link>
          {/* Botón de Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            <ArrowRightEndOnRectangleIcon className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </div>
      </div>


      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Ventas Totales" 
          value={stats.totalSales}
          icon={CurrencyDollarIcon}
          color="bg-blue-100"
        />
        
        <StatCard
          title="Stock Bajo"
          value={stats.lowStockItems}
          icon={ExclamationTriangleIcon}
          color="bg-red-100"
        />
        
        <StatCard
          title="Productos Activos"
          value={stats.recentSales.length}
          icon={ShoppingCartIcon}
          color="bg-green-100"
        />
        
        <StatCard
          title="Tasa Conversión"
          value="98%"
          icon={ChartBarIcon}
          color="bg-purple-100"
        />
      </div>

      {/* Gráfico y tabla */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart data={stats.salesData} />
        <RecentSales sales={stats.recentSales} />
      </div>

      {/* Alertas de stock */}
      <LowStockItems />
    </div>
  )
}

// Componentes auxiliares (deben estar en el mismo archivo o importarse)
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`${color} p-4 rounded-full`}>
        <Icon className="w-6 h-6 text-gray-700" />
      </div>
    </div>
  </div>
)

export default Dashboard 