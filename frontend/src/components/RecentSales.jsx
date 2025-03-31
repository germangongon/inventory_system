import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const RecentSales = ({ sales }) => {
  console.log(sales); // Depuración: Ver qué datos están llegando

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Ventas Recientes</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3">Fecha</th>
              <th className="pb-3">Cliente</th>
              <th className="pb-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="py-3">
                  {format(new Date(sale.fecha), 'dd MMM yyyy', { locale: es })}
                </td>
                <td className="py-3">{sale.cliente_info?.nombre || 'N/A'}</td>
                <td className="py-3 text-right font-medium">
                  ${parseFloat(sale.total).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sales.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No hay ventas recientes
          </p>
        )}
      </div>
    </div>
  )
}

export default RecentSales
