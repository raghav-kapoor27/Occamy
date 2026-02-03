import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Package, ShoppingCart } from 'lucide-react';

const COLORS = ['#059669', '#0891b2', '#7c3aed', '#ea580c'];

export function DistributorAnalytics() {
  const { user } = useAuth();
  const { sales, samples } = useData();

  const distributorSales = useMemo(
    () => sales.filter((s) => s.userId === user?.id),
    [sales, user?.id]
  );
  const distributorSamples = useMemo(
    () => samples.filter((s) => s.userId === user?.id),
    [samples, user?.id]
  );

  // Monthly sales data
  const monthlyData = useMemo(() => {
    const months: Record<string, { sales: number; volume: number }> = {};
    distributorSales.forEach((sale) => {
      const month = new Date(sale.date).toLocaleDateString('en-US', { month: 'short' });
      if (!months[month]) {
        months[month] = { sales: 0, volume: 0 };
      }
      months[month].sales += sale.amount;
      months[month].volume += sale.quantity;
    });
    return Object.entries(months).map(([month, data]) => ({
      month,
      sales: data.sales / 1000, // Convert to thousands
      volume: data.volume,
    }));
  }, [distributorSales]);

  // Sales type distribution
  const salesTypeData = useMemo(() => {
    const b2b = distributorSales.filter((s) => s.type === 'B2B').reduce((sum, s) => sum + s.amount, 0);
    const b2c = distributorSales.filter((s) => s.type === 'B2C').reduce((sum, s) => sum + s.amount, 0);
    return [
      { name: 'B2B Sales', value: b2b },
      { name: 'B2C Sales', value: b2c },
    ];
  }, [distributorSales]);

  const totalSales = distributorSales.reduce((sum, s) => sum + s.amount, 0);
  const totalVolume = distributorSales.reduce((sum, s) => sum + s.quantity, 0);
  const totalSamples = distributorSamples.reduce((sum, s) => sum + s.quantity, 0);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Analytics</h1>
        <p className="text-gray-600 mt-1">Performance insights and trends</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Sales</p>
              <p className="text-2xl font-bold text-gray-800">
                ₹{(totalSales / 1000).toFixed(1)}K
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Volume</p>
              <p className="text-2xl font-bold text-gray-800">{totalVolume} units</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Samples Distributed</p>
              <p className="text-2xl font-bold text-gray-800">{totalSamples} kg</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        {monthlyData.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Monthly Sales Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}K`} />
                <Bar dataKey="sales" fill="#059669" name="Sales (₹K)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Sales Distribution */}
        {salesTypeData[0].value > 0 || salesTypeData[1].value > 0 ? (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">Sales Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={salesTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {salesTypeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-center min-h-[250px]">
            <p className="text-gray-500">No sales data available</p>
          </div>
        )}
      </div>
    </div>
  );
}
