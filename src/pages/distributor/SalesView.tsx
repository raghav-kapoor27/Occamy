import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { ShoppingCart, TrendingUp, MapPin } from 'lucide-react';

export function SalesView() {
  const { user } = useAuth();
  const { sales } = useData();

  const distributorSales = useMemo(
    () => sales.filter((s) => s.userId === user?.id).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ),
    [sales, user?.id]
  );

  const totalSales = distributorSales.reduce((sum, s) => sum + s.amount, 0);
  const totalVolume = distributorSales.reduce((sum, s) => sum + s.quantity, 0);
  const b2bSales = distributorSales.filter((s) => s.type === 'B2B').reduce((sum, s) => sum + s.amount, 0);
  const b2cSales = distributorSales.filter((s) => s.type === 'B2C').reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Sales Overview</h1>
        <p className="text-gray-600 mt-1">Track all your sales transactions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">
                ₹{(totalSales / 1000).toFixed(1)}K
              </p>
              <p className="text-xs text-gray-500">Total Sales</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{totalVolume}</p>
              <p className="text-xs text-gray-500">Units Sold</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">
                ₹{(b2bSales / 1000).toFixed(1)}K
              </p>
              <p className="text-xs text-gray-500">B2B Sales</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">
                ₹{(b2cSales / 1000).toFixed(1)}K
              </p>
              <p className="text-xs text-gray-500">B2C Sales</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sales List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800 text-lg">Recent Sales</h3>
        </div>
        {distributorSales.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-semibold text-gray-600 mb-2">No Sales Found</p>
            <p className="text-gray-500">Start recording sales to see them here</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {distributorSales.map((sale) => (
              <div
                key={sale.id}
                className="p-4 md:p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-800 text-lg">
                        {sale.customerName}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          sale.type === 'B2B'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {sale.type}
                      </span>
                      {sale.isRepeatOrder && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          Repeat
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                      <div>
                        <span className="text-gray-500">Product:</span>{' '}
                        <span className="font-medium">{sale.productSKU}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Quantity:</span>{' '}
                        <span className="font-medium">{sale.quantity} units</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Pack Size:</span>{' '}
                        <span className="font-medium">{sale.packSize}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs">{sale.location.address?.split(',')[0]}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-600">
                      ₹{sale.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(sale.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(sale.date).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
