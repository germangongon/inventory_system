import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

const StockAlert = ({ producto }) => {
  return (
    <div className="flex items-center gap-2 text-sm text-red-600 mt-1">
      <ExclamationTriangleIcon className="w-4 h-4" />
      <span>Stock bajo: {producto.stock} unidades restantes</span>
    </div>
  )
}