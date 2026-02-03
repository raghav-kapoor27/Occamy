import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { mockUsers, products } from '../../data/mockData';
import { ShoppingCart, Search, MapPin, TrendingUp, RefreshCcw } from 'lucide-react';
import { format } from 'date-fns';

export function AdminSales() {
  const { sales } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const getUserName = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    return user?.name || 'Unknown';
  };

  const getProductName = (sku: string) => {
    const product = products.find(p => p.sku === sku);
    return product?.name || sku;
  };

  const filteredSales = sales.filter(sale => {
    const matchesSearch =
      sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getProductName(sale.productSKU).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || sale.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const totalB2C = sales.filter(s => s.type === 'B2C').reduce((sum, s) => sum + s.amount, 0);
  const totalB2B = sales.filter(s => s.type === 'B2B').reduce((sum, s) => sum + s.amount, 0);
  const totalAmount = totalB2C + totalB2B;
  const repeatOrders = sales.filter(s => s.isRepeatOrder).length;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Sales</h1>
        <p className="text-gray-500">Track all B2C and B2B sales</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Search by customer or product..."
            />
          </div>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white"
          >
            <option value="all">All Types</option>
            <option value="B2C">B2C Only</option>
            <option value="B2B">B2B Only</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <p className="text-sm text-gray-500">Total Revenue</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">₹{totalAmount.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-blue-600">₹{totalB2C.toLocaleString()}</p>
          <p className="text-sm text-gray-500">B2C Sales</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-purple-600">₹{totalB2B.toLocaleString()}</p>
          <p className="text-sm text-gray-500">B2B Sales</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <RefreshCcw className="w-5 h-5 text-amber-500" />
            <p className="text-sm text-gray-500">Repeat Orders</p>
          </div>
          <p className="text-2xl font-bold text-gray-800">{repeatOrders}</p>
        </div>
      </div>

      {/* Sales List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Product</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Customer</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Qty</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Mode</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Location</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Officer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSales.map(sale => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{format(new Date(sale.date), 'MMM d, yyyy')}</p>
                    <p className="text-gray-500 text-xs">{format(new Date(sale.date), 'h:mm a')}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      sale.type === 'B2C' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {sale.type}
                    </span>
                    {sale.isRepeatOrder && (
                      <span className="ml-1 px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-700">
                        Repeat
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-purple-500" />
                      <div>
                        <p className="font-medium">{getProductName(sale.productSKU)}</p>
                        <p className="text-xs text-gray-500">{sale.packSize}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{sale.customerName}</td>
                  <td className="px-4 py-3 font-medium">{sale.quantity}</td>
                  <td className="px-4 py-3 font-bold text-emerald-600">₹{sale.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      sale.mode === 'direct' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {sale.mode === 'direct' ? 'Direct' : 'Via Distributor'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span className="text-xs">{sale.location.address || `${sale.location.lat.toFixed(2)}, ${sale.location.lng.toFixed(2)}`}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{getUserName(sale.userId)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredSales.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No sales found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
}
