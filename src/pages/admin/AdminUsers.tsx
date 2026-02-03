import { useState } from 'react';
import { mockUsers } from '../../data/mockData';
import { useData } from '../../context/DataContext';
import { User, MapPin, Phone, Mail, Search } from 'lucide-react';

export function AdminUsers() {
  const { meetings, sales, dailyLogs } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const users = mockUsers.filter(u => u.role !== 'admin');

  const getUserStats = (userId: string) => {
    const userMeetings = meetings.filter(m => m.userId === userId);
    const userSales = sales.filter(s => s.userId === userId);
    const userLogs = dailyLogs.filter(l => l.userId === userId);
    const totalDistance = userLogs.reduce((sum, l) => sum + (l.distanceTraveled || 0), 0);
    const totalSales = userSales.reduce((sum, s) => sum + s.amount, 0);

    return {
      meetings: userMeetings.length,
      sales: userSales.length,
      totalSales,
      distance: totalDistance,
    };
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.state.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Users</h1>
        <p className="text-gray-500">Manage field officers and distributors</p>
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Search by name, email, or state..."
            />
          </div>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          >
            <option value="all">All Roles</option>
            <option value="field_officer">Field Officers</option>
            <option value="distributor">Distributors</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-gray-800">{users.length}</p>
          <p className="text-sm text-gray-500">Total Users</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-blue-600">{users.filter(u => u.role === 'field_officer').length}</p>
          <p className="text-sm text-gray-500">Field Officers</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-purple-600">{users.filter(u => u.role === 'distributor').length}</p>
          <p className="text-sm text-gray-500">Distributors</p>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map(user => {
          const stats = getUserStats(user.id);
          return (
            <div key={user.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{user.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    user.role === 'field_officer' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {user.role === 'field_officer' ? 'Field Officer' : 'Distributor'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{user.district}, {user.state}</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-lg font-bold text-emerald-600">{stats.meetings}</p>
                  <p className="text-xs text-gray-500">Meetings</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-600">{stats.sales}</p>
                  <p className="text-xs text-gray-500">Sales</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-purple-600">{stats.distance}</p>
                  <p className="text-xs text-gray-500">km</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-amber-600">₹{(stats.totalSales/1000).toFixed(0)}K</p>
                  <p className="text-xs text-gray-500">Revenue</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500">
          No users found matching your criteria
        </div>
      )}
    </div>
  );
}
