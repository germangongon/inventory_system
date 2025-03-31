import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const SalesChart = ({ data }) => {
  // Datos de ejemplo si no hay datos reales
  const demoData = [
    { date: '01/01', total: 400 },
    { date: '02/01', total: 300 },
    { date: '03/01', total: 600 },
    { date: '04/01', total: 800 },
    { date: '05/01', total: 500 },
  ]

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Tendencia de Ventas</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data?.length > 0 ? data : demoData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#6b7280' }}
              tickMargin={10}
            />
            <YAxis 
              tick={{ fill: '#6b7280' }}
              tickMargin={10}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: '0.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ fill: '#1d4ed8', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#1e40af' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {!data?.length && (
        <p className="text-center text-gray-500 mt-4">
          [Datos de demostración - Conecta tu backend para ver datos reales]
        </p>
      )}
    </div>
  )
}

export default SalesChart