import { Link } from 'react-router-dom'
import { 
  CurrencyDollarIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  ArrowRightEndOnRectangleIcon,
  HomeIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'

const Navbar = () => {
  const { logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    {
      to: "/sales/new",
      icon: CurrencyDollarIcon,
      label: "Nueva Venta",
      color: "bg-slate-800 hover:bg-slate-900"
    },
    {
      to: "/customers",
      icon: UserGroupIcon,
      label: "Ver Clientes",
      color: "bg-slate-800 hover:bg-slate-900"
    },
    {
      to: "/products",
      icon: ShoppingCartIcon,
      label: "Productos",
      color: "bg-slate-800 hover:bg-slate-900"
    }
  ]

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo y menú móvil */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center gap-2 text-slate-800 hover:text-slate-900 transition-colors duration-200"
            >
              <HomeIcon className="w-5 h-5" />
              <span className="font-medium text-base">Panel Principal</span>
            </Link>
          </div>

          {/* Botón de menú móvil */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500"
            >
              {isOpen ? (
                <XMarkIcon className="h-5 w-5" />
              ) : (
                <Bars3Icon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Menú de escritorio */}
          <div className="hidden lg:flex items-center gap-3">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 ${item.color} text-white px-3 py-1.5 rounded-md transition-all duration-200 text-sm font-medium`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-md transition-all duration-200 text-sm font-medium"
            >
              <ArrowRightEndOnRectangleIcon className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        <div className={`lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 ${item.color} text-white px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium mb-1`}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium"
            >
              <ArrowRightEndOnRectangleIcon className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 