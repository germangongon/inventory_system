import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'

const RecentSales = ({ sales }) => {
  console.log(sales); // Debug: Check what data is coming

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Recent Sales</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3">Date</th>
              <th className="pb-3">Customer</th>
              <th className="pb-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="py-3">
                  {format(new Date(sale.date), 'dd MMM yyyy', { locale: enUS })}
                </td>
                <td className="py-3">{sale.customer_info?.name || 'N/A'}</td>
                <td className="py-3 text-right font-medium">
                  ${parseFloat(sale.total).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sales.length === 0 && (
          <p className="text-center text-gray-500 py-4">
            No recent sales
          </p>
        )}
      </div>
    </div>
  )
}

export default RecentSales
