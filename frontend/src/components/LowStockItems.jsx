import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import api from '../services/api'
import { useState, useEffect } from 'react'

const LowStockItems = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchLowStock = async () => {
      try {
        const response = await api.get('/products/?stock__lt=10')
        setProducts(response.data)
      } catch (error) {
        console.error('Error fetching low stock:', error)
      }
    }
    fetchLowStock()
  }, [])

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mt-6">
      <h3 className="text-lg font-semibold mb-4">Productos con Stock Bajo</h3>
      <div className="space-y-3">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100"
          >
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-gray-600">Código: {product.code || 'N/A'}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-red-600 font-medium">
                {product.stock} unidades
              </span>
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <p className="text-center text-gray-500 py-2">
            No hay productos con stock bajo
          </p>
        )}
      </div>
    </div>
  )
}

export default LowStockItems