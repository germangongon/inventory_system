import { useEffect, useState } from 'react'
import { getProducts, deleteProduct } from '../services/api'
import { Link } from 'react-router-dom'
import { PlusIcon } from '@heroicons/react/24/outline'

const Products = () => {
  const [products, setProducts] = useState([])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      await deleteProduct(id)
      fetchProducts()
    }
  }

  return (
    <div className="p-6 bg-white shadow rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Lista de Productos</h2>
        <Link 
          to="/products/new" 
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-md transition-all duration-200"
        >
          <PlusIcon className="w-5 h-5" />
          Agregar Producto
        </Link>
      </div>
      
      <table className="w-full mt-4 border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Código</th>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Precio</th>
            <th className="p-2 border">Stock</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="p-2 border">{product.code}</td>
              <td className="p-2 border">{product.name}</td>
              <td className="p-2 border">${product.price}</td>
              <td className="p-2 border">{product.stock}</td>
              <td className="p-2 border">
                <Link to={`/products/edit/${product.id}`} className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded-md transition-colors duration-200">
                  Editar
                </Link>
                <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800 px-2 py-1 rounded-md transition-colors duration-200 ml-2">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Products
