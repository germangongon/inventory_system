import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import BotonVolver from '../../components/GoBackButton';

const CreateSale = () => {
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const { user } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    dni: '',
    direccion: '',
    telefono: ''
  });
  const [mostrarFormCliente, setMostrarFormCliente] = useState(false);

  // Cargar datos iniciales: clientes y productos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientesRes, productosRes] = await Promise.all([
          api.get('/clientes/'),
          api.get('/productos/')
        ]);
        setClientes(clientesRes.data);
        setProductos(productosRes.data);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };
    fetchData();
  }, []);

  // Registrar un nuevo cliente
  const registrarCliente = async () => {
    try {
      const response = await api.post('/clientes/', nuevoCliente);
      // Se agrega el nuevo cliente a la lista actual
      setClientes([...clientes, response.data]);
      setMostrarFormCliente(false);
    } catch (error) {
      console.error('Error registrando cliente:', error);
    }
  };

  // Función para agregar un producto al carrito
  const agregarProducto = (producto) => {
    const exist = carrito.find((item) => item.id === producto.id);
    if (exist) {
      // Si ya existe, se incrementa la cantidad
      setCarrito(carrito.map((item) =>
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      // Se agrega el producto con cantidad 1
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  // Función para eliminar un producto del carrito
  const eliminarProducto = (id) => {
    setCarrito(carrito.filter((item) => item.id !== id));
  };

  // Función para calcular el total de la venta
  const calcularTotal = () => {
    return carrito
      .reduce((total, item) => total + item.precio * item.cantidad, 0)
      .toFixed(2);
  };

  // Función para finalizar la venta
  const finalizarVenta = async () => {
    if (!clienteSeleccionado || carrito.length === 0) {
      console.error("Faltan datos para registrar la venta");
      return;
    }
  
    if (!user || !user.user_id) {
      console.error("El usuario no está autenticado correctamente");
      return;
    }
  
    const ventaData = {
      cliente: clienteSeleccionado?.id, // Solo enviar el ID del cliente
      detalles: carrito.map(item => ({
        producto: item.id, // Solo enviar el ID del producto
        cantidad: item.cantidad,
        precio_unitario: item.precio // Usar "precio_unitario" en lugar de "precio"
      }))
    };
    // Verificar token en la cabecera de la solicitud
    const token = localStorage.getItem('access')
    if (!token) {
      console.error("No se encontró el token de acceso.")
      return
    }

    try {
      const response = await api.post('/ventas/', ventaData);
      console.log('Venta registrada:', response.data)
      // Se limpia el carrito tras registrar la venta
      setCarrito([]);
    } catch (error) {
      console.error('Error registrando venta:', error);
    }
  };

  return (
    <div className="p-6">
      <BotonVolver /> {/* Botón para volver atrás */}
      {/* Sección Cliente */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Cliente</h3>
        {!mostrarFormCliente ? (
          <>
            <select
              className="w-full p-2 border rounded mb-2"
              value={clienteSeleccionado ? JSON.stringify(clienteSeleccionado) : ''}
              onChange={(e) =>
                setClienteSeleccionado(e.target.value ? JSON.parse(e.target.value) : null)
              }
            >
              <option value="">Seleccionar cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={JSON.stringify(cliente)}>
                  {cliente.nombre} - {cliente.dni} - {cliente.telefono}
                </option>
              ))}
            </select>
            <button
              onClick={() => setMostrarFormCliente(true)}
              className="text-blue-600 text-sm"
            >
              + Registrar nuevo cliente
            </button>
          </>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Nombre completo"
              className="w-full p-2 border rounded"
              value={nuevoCliente.nombre}
              onChange={(e) =>
                setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="DNI"
              className="w-full p-2 border rounded"
              value={nuevoCliente.dni}
              onChange={(e) =>
                setNuevoCliente({ ...nuevoCliente, dni: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Dirección"
              className="w-full p-2 border rounded"
              value={nuevoCliente.direccion}
              onChange={(e) =>
                setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })
              }
            />
            <input
              type="tel"
              placeholder="Teléfono"
              className="w-full p-2 border rounded"
              value={nuevoCliente.telefono}
              onChange={(e) =>
                setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })
              }
            />
            <div className="flex gap-2">
              <button
                onClick={registrarCliente}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Guardar
              </button>
              <button
                onClick={() => setMostrarFormCliente(false)}
                className="bg-gray-200 px-3 py-1 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sección Productos Disponibles */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Productos Disponibles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productos.length > 0 ? (
            productos.map((producto) => (
              <div key={producto.id} className="border p-4 rounded flex flex-col">
                <p className="font-semibold">{producto.nombre}</p>
                <p className="text-sm text-gray-600">${producto.precio}</p>
                <p className="text-sm text-gray-600">Stock: {producto.stock}</p>
                <button
                  onClick={() => agregarProducto(producto)}
                  className="mt-auto bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Agregar
                </button>
              </div>
            ))
          ) : (
            <p>No hay productos disponibles.</p>
          )}
        </div>
      </div>

      {/* Carrito de Compras */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Resumen de Venta</h3>
        <div className="mb-6">
          {carrito.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 border-b">
              <div>
                <p className="font-medium">{item.nombre}</p>
                <p className="text-sm text-gray-600">
                  ${item.precio} x {item.cantidad}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-medium">
                  ${(item.precio * item.cantidad).toFixed(2)}
                </span>
                <button
                  onClick={() => eliminarProducto(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ❌
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600">Cliente seleccionado:</p>
            <p className="font-medium">
              {clienteSeleccionado?.nombre || 'Ninguno'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">
              Total: ${calcularTotal()}
            </p>
            <button
              onClick={finalizarVenta}
              disabled={!clienteSeleccionado || carrito.length === 0}
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
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
