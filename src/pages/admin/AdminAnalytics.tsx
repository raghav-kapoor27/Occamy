import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useData } from '../../context/DataContext';
import { mockUsers, getStateWiseData, products } from '../../data/mockData';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const COLORS = ['#059669', '#0891b2', '#7c3aed', '#ea580c', '#ec4899', '#f59e0b'];

// Fix for default marker icons in Leaflet with React
import L from 'leaflet';
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export function AdminAnalytics() {
  const { meetings, sales, samples, dailyLogs } = useData();

  const userPerformance = useMemo(() => {
    return mockUsers
      .filter(u => u.role !== 'admin')
      .map(user => {
        const userMeetings = meetings.filter(m => m.userId === user.id);
        const userSales = sales.filter(s => s.userId === user.id);
        const userLogs = dailyLogs.filter(l => l.userId === user.id);
        
        return {
          name: user.name.split(' ')[0],
          meetings: userMeetings.length,
          sales: userSales.reduce((sum, s) => sum + s.amount, 0) / 1000,
          distance: userLogs.reduce((sum, l) => sum + (l.distanceTraveled || 0), 0),
        };
      });
  }, [meetings, sales, dailyLogs]);

  const productSales = useMemo(() => {
    const productMap: Record<string, number> = {};
    sales.forEach(sale => {
      const product = products.find(p => p.sku === sale.productSKU);
      const name = product?.name || sale.productSKU;
      productMap[name] = (productMap[name] || 0) + sale.amount;
    });
    return Object.entries(productMap).map(([name, value]) => ({ name, value }));
  }, [sales]);

  const categoryDistribution = useMemo(() => {
    const counts = { farmer: 0, seller: 0, influencer: 0, group: 0 };
    meetings.forEach(m => {
      if (m.type === 'group') {
        counts.group += m.attendeeCount || 0;
      } else if (m.personCategory) {
        counts[m.personCategory]++;
      }
    });
    return [
      { name: 'Farmers', value: counts.farmer },
      { name: 'Sellers', value: counts.seller },
      { name: 'Influencers', value: counts.influencer },
      { name: 'Group Attendees', value: counts.group },
    ];
  }, [meetings]);

  const stateData = getStateWiseData();

  // Map markers from meetings
  const mapMarkers = useMemo(() => {
    return meetings.slice(0, 10).map(m => ({
      position: [m.location.lat, m.location.lng] as LatLngExpression,
      name: m.personName || m.villageName || 'Meeting',
      type: m.type,
    }));
  }, [meetings]);

  const defaultCenter: LatLngExpression = [22.5, 78.5]; // Center of India

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
        <p className="text-gray-500">Detailed insights and visualizations</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white">
          <p className="text-3xl font-bold">{meetings.length}</p>
          <p className="text-emerald-100">Total Meetings</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <p className="text-3xl font-bold">{sales.length}</p>
          <p className="text-blue-100">Total Sales</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <p className="text-3xl font-bold">{samples.length}</p>
          <p className="text-purple-100">Samples Given</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-4 text-white">
          <p className="text-3xl font-bold">₹{(sales.reduce((s, sale) => s + sale.amount, 0) / 1000).toFixed(0)}K</p>
          <p className="text-amber-100">Total Revenue</p>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-4 text-white">
          <p className="text-3xl font-bold">{dailyLogs.reduce((s, l) => s + (l.distanceTraveled || 0), 0)}</p>
          <p className="text-pink-100">Km Traveled</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* User Performance */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">User Performance</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={userPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" fontSize={12} />
              <YAxis dataKey="name" type="category" width={60} fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="meetings" fill="#059669" name="Meetings" />
              <Bar dataKey="distance" fill="#0891b2" name="Distance (km)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Product Sales */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Sales by Product</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={productSales}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name }) => String(name || '').split(' ')[0]}
              >
                {productSales.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">People Reached by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="value" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* State Performance */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">State-wise Sales</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={stateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="state" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#059669"
                fill="#10b98150"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Map */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Meeting Locations</h3>
        <div className="h-[400px] rounded-lg overflow-hidden">
          <MapContainer
            center={defaultCenter}
            zoom={5}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {mapMarkers.map((marker, index) => (
              <Marker key={index} position={marker.position} icon={icon}>
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold">{marker.name}</p>
                    <p className="text-gray-500 capitalize">{marker.type.replace('-', ' ')}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">State-wise Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">State</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Meetings</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Sales (₹)</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Officers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stateData.map(state => (
                <tr key={state.state} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{state.state}</td>
                  <td className="px-4 py-3">{state.meetings}</td>
                  <td className="px-4 py-3 text-emerald-600 font-medium">₹{state.sales.toLocaleString()}</td>
                  <td className="px-4 py-3">{state.officers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
