import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { mockUsers, products } from '../../data/mockData';
import { Package, Search, MapPin } from 'lucide-react';
import { format } from 'date-fns';

export function AdminSamples() {
  const { samples } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [purposeFilter, setPurposeFilter] = useState<string>('all');

  const getUserName = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    return user?.name || 'Unknown';
  };

  const getProductName = (sku: string) => {
    const product = products.find(p => p.sku === sku);
    return product?.name || sku;
  };

  const filteredSamples = samples.filter(sample => {
    const matchesSearch =
      sample.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getProductName(sample.productSKU).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPurpose = purposeFilter === 'all' || sample.purpose === purposeFilter;

    return matchesSearch && matchesPurpose;
  });

  const totalQuantity = samples.reduce((sum, s) => sum + s.quantity, 0);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Sample Distributions</h1>
        <p className="text-gray-500">Track all sample distributions</p>
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Search by recipient or product..."
            />
          </div>
          <select
            value={purposeFilter}
            onChange={e => setPurposeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          >
            <option value="all">All Purposes</option>
            <option value="trial">Trial</option>
            <option value="demo">Demo</option>
            <option value="follow-up">Follow-up</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-gray-800">{samples.length}</p>
          <p className="text-sm text-gray-500">Total Distributions</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-blue-600">{totalQuantity} kg</p>
          <p className="text-sm text-gray-500">Total Quantity</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-green-600">{samples.filter(s => s.purpose === 'trial').length}</p>
          <p className="text-sm text-gray-500">Trial Samples</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-purple-600">{samples.filter(s => s.purpose === 'demo').length}</p>
          <p className="text-sm text-gray-500">Demo Samples</p>
        </div>
      </div>

      {/* Samples List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Product</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Quantity</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Recipient</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Purpose</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Location</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Officer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSamples.map(sample => (
                <tr key={sample.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{format(new Date(sample.date), 'MMM d, yyyy')}</p>
                    <p className="text-gray-500 text-xs">{format(new Date(sample.date), 'h:mm a')}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-blue-500" />
                      <span>{getProductName(sample.productSKU)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-blue-600">{sample.quantity} kg</td>
                  <td className="px-4 py-3">{sample.recipientName}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs capitalize ${
                      sample.recipientType === 'farmer' ? 'bg-green-100 text-green-700' :
                      sample.recipientType === 'distributor' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {sample.recipientType}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs capitalize ${
                      sample.purpose === 'trial' ? 'bg-purple-100 text-purple-700' :
                      sample.purpose === 'demo' ? 'bg-teal-100 text-teal-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {sample.purpose}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span className="text-xs">{sample.location.address || `${sample.location.lat.toFixed(2)}, ${sample.location.lng.toFixed(2)}`}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{getUserName(sample.userId)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredSamples.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No samples found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
}
