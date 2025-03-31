import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createProducto, getProductoById, updateProducto } from '../services/api'
import BotonVolver from './GoBackButton'

const ProductoForm = () => {
  const [producto, setProducto] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    precio: '',
    stock: ''
  })
  
  const { id } = useParams()  // Recuperamos el id del producto desde la URL
  const navigate = useNavigate()

  // Cargar el producto si es que estamos editando (id está presente)
  useEffect(() => {
    if (id) {
      fetchProducto()  // Si hay un id, obtenemos el producto
    }
  }, [id])

  const fetchProducto = async () => {
    try {
      const data = await getProductoById(id)  // Llamada para obtener los datos del producto
      setProducto({
        codigo: data.codigo,
        nombre: data.nombre,
        descripcion: data.descripcion || '',
        precio: data.precio,
        stock: data.stock
      })
    } catch (error) {
      console.error('Error cargando producto:', error)
    }
  }

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (id) {
        await updateProducto(id, producto)  // Si hay id, actualizamos el producto
      } else {
        await createProducto(producto)  // Si no hay id, lo creamos
      }
      navigate('/productos')  // Redirigimos a la lista de productos
    } catch (error) {
      console.error('Error guardando producto:', error)
    }
  }

  return (
    
    <div className="p-6 bg-white shadow rounded-xl">
      <BotonVolver/>
      <h2 className="text-xl font-semibold mb-4">{id ? 'Editar Producto' : 'Nuevo Producto'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-600">Código</label>
          <input
            type="text"
            name="codigo"
            value={producto.codigo}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={producto.nombre}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600">Descripción</label>
          <textarea
            name="descripcion"
            value={producto.descripcion}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600">Precio</label>
          <input
            type="number"
            step="0.01"
            name="precio"
            value={producto.precio}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600">Stock</label>
          <input
            type="number"
            name="stock"
            value={producto.stock}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {id ? 'Actualizar Producto' : 'Guardar Producto'}
        </button>
      </form>
    </div>
  )
}

export default ProductoForm

