import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createProduct, getProductById, updateProduct } from '../services/api'
import BotonVolver from './GoBackButton'

const ProductForm = () => {
  const [product, setProduct] = useState({
    code: '',
    name: '',
    description: '',
    price: '',
    stock: ''
  })
  
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id])

  const fetchProduct = async () => {
    try {
      const data = await getProductById(id)
      setProduct({
        code: data.code,
        name: data.name,
        description: data.description || '',
        price: data.price,
        stock: data.stock
      })
    } catch (error) {
      console.error('Error loading product:', error)
    }
  }

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (id) {
        await updateProduct(id, product)
      } else {
        await createProduct(product)
      }
      navigate('/products')
    } catch (error) {
      console.error('Error saving product:', error)
    }
  }

  return (
    <div className="p-6 bg-white shadow rounded-xl">
      <BotonVolver/>
      <h2 className="text-xl font-semibold mb-4">{id ? 'Edit Product' : 'New Product'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-600">Code</label>
          <input
            type="text"
            name="code"
            value={product.code}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600">Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600">Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600">Price</label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={product.price}
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
            value={product.stock}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {id ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  )
}

export default ProductForm

