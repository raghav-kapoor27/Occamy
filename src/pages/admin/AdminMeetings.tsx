import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { mockUsers } from '../../data/mockData';
import { MapPin, User, Users, Search } from 'lucide-react';
import { format } from 'date-fns';

export function AdminMeetings() {
  const { meetings } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'one-on-one' | 'group'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const getUserName = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    return user?.name || 'Unknown';
  };

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch =
      (meeting.personName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       meeting.villageName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       meeting.location.address?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || meeting.type === typeFilter;
    const matchesCategory = categoryFilter === 'all' || meeting.personCategory === categoryFilter;

    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Meetings</h1>
        <p className="text-gray-500">View all logged meetings and interactions</p>
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
              placeholder="Search by name, village, or location..."
            />
          </div>
          <div className="flex gap-2">
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value as 'all' | 'one-on-one' | 'group')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
            >
              <option value="all">All Types</option>
              <option value="one-on-one">One-on-One</option>
              <option value="group">Group</option>
            </select>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
            >
              <option value="all">All Categories</option>
              <option value="farmer">Farmer</option>
              <option value="seller">Seller</option>
              <option value="influencer">Influencer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-gray-800">{meetings.length}</p>
          <p className="text-sm text-gray-500">Total Meetings</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-blue-600">{meetings.filter(m => m.type === 'one-on-one').length}</p>
          <p className="text-sm text-gray-500">One-on-One</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-purple-600">{meetings.filter(m => m.type === 'group').length}</p>
          <p className="text-sm text-gray-500">Group Meetings</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-emerald-600">
            {meetings.filter(m => m.type === 'group').reduce((sum, m) => sum + (m.attendeeCount || 0), 0)}
          </p>
          <p className="text-sm text-gray-500">Total Attendees</p>
        </div>
      </div>

      {/* Meetings List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Date & Time</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Person/Village</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Category</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Location</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Field Officer</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Potential</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMeetings.map(meeting => (
                <tr key={meeting.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{format(new Date(meeting.date), 'MMM d, yyyy')}</p>
                    <p className="text-gray-500 text-xs">{format(new Date(meeting.date), 'h:mm a')}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                      meeting.type === 'one-on-one' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {meeting.type === 'one-on-one' ? <User className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                      {meeting.type === 'one-on-one' ? 'One-on-One' : 'Group'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{meeting.personName || meeting.villageName}</p>
                    {meeting.attendeeCount && (
                      <p className="text-gray-500 text-xs">{meeting.attendeeCount} attendees</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {meeting.personCategory ? (
                      <span className={`px-2 py-1 rounded-full text-xs capitalize ${
                        meeting.personCategory === 'farmer' ? 'bg-green-100 text-green-700' :
                        meeting.personCategory === 'seller' ? 'bg-orange-100 text-orange-700' :
                        'bg-indigo-100 text-indigo-700'
                      }`}>
                        {meeting.personCategory}
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                        {meeting.meetingType}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span className="text-xs">{meeting.location.address || `${meeting.location.lat.toFixed(2)}, ${meeting.location.lng.toFixed(2)}`}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{getUserName(meeting.userId)}</td>
                  <td className="px-4 py-3">
                    {meeting.businessPotential ? (
                      <span className="text-emerald-600 font-medium">{meeting.businessPotential}</span>
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredMeetings.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No meetings found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
}
