import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import BotonVolver from '../../components/GoBackButton';
import { PlusIcon, XMarkIcon, UserPlusIcon } from '@heroicons/react/24/outline';

const CreateSale = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    dni: '',
    address: '',
    phone: ''
  });
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  // Load initial data: customers and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersRes, productsRes] = await Promise.all([
          api.get('/customers/'),
          api.get('/products/')
        ]);
        setCustomers(customersRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    fetchData();
  }, []);

  // Register a new customer
  const registerCustomer = async () => {
    try {
      const response = await api.post('/customers/', newCustomer);
      setCustomers([...customers, response.data]);
      setShowCustomerForm(false);
    } catch (error) {
      console.error('Error registering customer:', error);
    }
  };

  // Add product to cart
  const addProduct = (product) => {
    const exist = cart.find((item) => item.id === product.id);
    if (exist) {
      setCart(cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Remove product from cart
  const removeProduct = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Calculate total
  const calculateTotal = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  // Complete sale
  const completeSale = async () => {
    if (!selectedCustomer || cart.length === 0) {
      console.error("Missing data to register the sale");
      return;
    }
  
    if (!user || !user.user_id) {
      console.error("User is not properly authenticated");
      return;
    }
  
    const saleData = {
      customer: selectedCustomer?.id,
      details: cart.map(item => ({
        product: item.id,
        quantity: item.quantity,
        unit_price: item.price
      }))
    };

    const token = localStorage.getItem('access')
    if (!token) {
      console.error("Access token not found.")
      return
    }

    try {
      const response = await api.post('/sales/', saleData);
      console.log('Sale registered:', response.data)
      setCart([]);
    } catch (error) {
      console.error('Error registering sale:', error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <BotonVolver />
      
      {/* Customer Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">Cliente</h3>
        {!showCustomerForm ? (
          <div className="space-y-4">
            <select
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              value={selectedCustomer ? JSON.stringify(selectedCustomer) : ''}
              onChange={(e) =>
                setSelectedCustomer(e.target.value ? JSON.parse(e.target.value) : null)
              }
            >
              <option value="">Seleccionar cliente</option>
              {customers.map((customer) => (
                <option key={customer.id} value={JSON.stringify(customer)}>
                  {customer.name} - {customer.dni} - {customer.phone}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowCustomerForm(true)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              <UserPlusIcon className="w-5 h-5" />
              <span>Registrar nuevo cliente</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  placeholder="Nombre del cliente"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">DNI</label>
                <input
                  type="text"
                  placeholder="DNI del cliente"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={newCustomer.dni}
                  onChange={(e) => setNewCustomer({...newCustomer, dni: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  placeholder="Dirección del cliente"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="text"
                  placeholder="Teléfono del cliente"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowCustomerForm(false)}
                className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-md transition-all duration-200 text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={registerCustomer}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-md transition-all duration-200 text-sm font-medium"
              >
                Registrar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Available Products */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">Productos Disponibles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex flex-col h-full">
                  <div className="flex-grow">
                    <h4 className="font-semibold text-lg text-gray-800">{product.name}</h4>
                    <p className="text-blue-600 font-medium text-lg mt-2">${product.price}</p>
                    <p className="text-sm text-gray-600 mt-1">Stock: {product.stock}</p>
                  </div>
                  <button
                    onClick={() => addProduct(product)}
                    className="mt-4 flex items-center justify-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-900 transition-colors duration-200 self-end"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Agregar</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No hay productos disponibles.</p>
          )}
        </div>
      </div>

      {/* Shopping Cart */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">Resumen de Venta</h3>
        <div className="mb-6 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <div>
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-600">
                  ${item.price} x {item.quantity}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <span className="font-medium text-lg text-blue-600">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => removeProduct(item.id)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Cliente seleccionado:</p>
            <p className="font-medium text-gray-800">
              {selectedCustomer?.name || 'Ninguno'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-blue-600">
              Total: ${calculateTotal()}
            </p>
            <button
              onClick={completeSale}
              disabled={!selectedCustomer || cart.length === 0}
              className="mt-6 bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Registrar Venta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSale;
