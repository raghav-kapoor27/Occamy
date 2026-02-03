import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { useData } from '../../context/DataContext';
import {
  TrendingUp,
  Users,
  MapPin,
  Package,
  ShoppingCart,
  Truck,
  Target,
  Calendar,
} from 'lucide-react';
import { getMonthlyData, getStateWiseData, mockUsers } from '../../data/mockData';

const COLORS = ['#059669', '#0891b2', '#7c3aed', '#ea580c'];

export function AdminDashboard() {
  const { meetings, samples, sales, dailyLogs } = useData();

  const stats = useMemo(() => {
    const totalDistance = dailyLogs.reduce((sum, log) => sum + (log.distanceTraveled || 0), 0);
    const meetingsCount = meetings.length;
    const farmersContacted = meetings.filter(m => m.personCategory === 'farmer').length +
      meetings.filter(m => m.type === 'group').reduce((sum, m) => sum + (m.attendeeCount || 0), 0);
    const b2cSales = sales.filter(s => s.type === 'B2C').reduce((sum, s) => sum + s.amount, 0);
    const b2bSales = sales.filter(s => s.type === 'B2B').reduce((sum, s) => sum + s.amount, 0);
    const samplesDistributed = samples.reduce((sum, s) => sum + s.quantity, 0);
    const totalVolume = sales.reduce((sum, s) => sum + s.quantity, 0);

    return {
      totalDistance,
      meetingsCount,
      farmersContacted,
      b2cSales,
      b2bSales,
      samplesDistributed,
      totalVolume,
      fieldOfficers: mockUsers.filter(u => u.role !== 'admin').length,
    };
  }, [meetings, samples, sales, dailyLogs]);

  const monthlyData = getMonthlyData();
  const stateData = getStateWiseData();

  const salesTypeData = [
    { name: 'B2C Sales', value: stats.b2cSales },
    { name: 'B2B Sales', value: stats.b2bSales },
  ];

  const statCards = [
    { label: 'Total Distance', value: `${stats.totalDistance} km`, icon: Truck, color: 'bg-blue-500' },
    { label: 'Meetings', value: stats.meetingsCount, icon: MapPin, color: 'bg-emerald-500' },
    { label: 'Farmers Reached', value: stats.farmersContacted, icon: Users, color: 'bg-purple-500' },
    { label: 'Samples Given', value: `${stats.samplesDistributed} kg`, icon: Package, color: 'bg-orange-500' },
    { label: 'B2C Sales', value: `₹${(stats.b2cSales / 1000).toFixed(1)}K`, icon: ShoppingCart, color: 'bg-teal-500' },
    { label: 'B2B Sales', value: `₹${(stats.b2bSales / 1000).toFixed(1)}K`, icon: Target, color: 'bg-indigo-500' },
    { label: 'Total Volume', value: `${stats.totalVolume} units`, icon: TrendingUp, color: 'bg-pink-500' },
    { label: 'Active Officers', value: stats.fieldOfficers, icon: Calendar, color: 'bg-amber-500' },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500">Overview of field operations</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`${card.color} p-2 rounded-lg`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                <p className="text-xs text-gray-500">{card.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="meetings"
                stroke="#059669"
                strokeWidth={2}
                dot={{ fill: '#059669' }}
              />
              <Line
                type="monotone"
                dataKey="distance"
                stroke="#0891b2"
                strokeWidth={2}
                dot={{ fill: '#0891b2' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sales Distribution */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Sales Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={salesTypeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
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
      </div>

      {/* State-wise Performance */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">State-wise Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stateData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="state" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Legend />
            <Bar dataKey="meetings" fill="#059669" name="Meetings" />
            <Bar dataKey="officers" fill="#0891b2" name="Officers" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Recent Meetings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Person/Village</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Location</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Potential</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {meetings.slice(0, 5).map(meeting => (
                <tr key={meeting.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{new Date(meeting.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      meeting.type === 'one-on-one' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {meeting.type === 'one-on-one' ? 'One-on-One' : 'Group'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {meeting.personName || meeting.villageName}
                    {meeting.attendeeCount && ` (${meeting.attendeeCount} attendees)`}
                  </td>
                  <td className="px-4 py-3">{meeting.location.address}</td>
                  <td className="px-4 py-3">{meeting.businessPotential || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
