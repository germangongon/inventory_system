import { useEffect, useState } from 'react'
import { getProductos, deleteProducto } from '../services/api'
import { Link } from 'react-router-dom'


const Productos = () => {
  const [productos, setProductos] = useState([])

  useEffect(() => {
    fetchProductos()
  }, [])

  const fetchProductos = async () => {
    try {
      const data = await getProductos()
      setProductos(data)
    } catch (error) {
      console.error('Error cargando productos:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      await deleteProducto(id)
      fetchProductos()
    }
  }

  return (
    <div className="p-6 bg-white shadow rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Lista de Productos</h2>
      <Link to="/productos/nuevo" className="bg-blue-500 text-white px-4 py-2 rounded">
        + Agregar Producto
      </Link>
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
          {productos.map((producto) => (
            <tr key={producto.id} className="hover:bg-gray-50">
              <td className="p-2 border">{producto.codigo}</td>
              <td className="p-2 border">{producto.nombre}</td>
              <td className="p-2 border">${producto.precio}</td>
              <td className="p-2 border">{producto.stock}</td>
              <td className="p-2 border">
                <Link to={`/productos/editar/${producto.id}`} className="text-blue-500 mr-2">
                  Editar
                </Link>
                <button onClick={() => handleDelete(producto.id)} className="text-red-500">
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

export default Productos
