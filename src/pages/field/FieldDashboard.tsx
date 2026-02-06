import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  MapPin,
  Package,
  ShoppingCart,
  PlayCircle,
  StopCircle,
  Clock,
  Navigation,
  CheckCircle,
  AlertCircle,
  LogOut,
} from 'lucide-react';
import { DailyLog, Location } from '../../types';

export function FieldDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { meetings, samples, sales, currentDayLog, startDay, endDay } = useData();
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  const [odometerStart, setOdometerStart] = useState('');
  const [odometerEnd, setOdometerEnd] = useState('');
  const [locationError, setLocationError] = useState('');
  const [showStartModal, setShowStartModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: new Date(),
          });
        },
        (error) => {
          setLocationError('Unable to get location: ' + error.message);
        }
      );
    }
  }, []);

  const todayMeetings = meetings.filter(
    m => m.userId === user?.id && new Date(m.date).toDateString() === new Date().toDateString()
  );
  const todaySamples = samples.filter(
    s => s.userId === user?.id && new Date(s.date).toDateString() === new Date().toDateString()
  );
  const todaySales = sales.filter(
    s => s.userId === user?.id && new Date(s.date).toDateString() === new Date().toDateString()
  );

  const handleStartDay = () => {
    if (!currentLocation) {
      setLocationError('Location is required to start the day');
      return;
    }

    const log: DailyLog = {
      id: 'dl-' + Date.now(),
      userId: user?.id || '',
      date: new Date(),
      startTime: new Date(),
      startLocation: currentLocation,
      odometerStart: odometerStart ? parseInt(odometerStart) : undefined,
      locationHistory: [currentLocation],
    };

    startDay(log);
    setShowStartModal(false);
    setOdometerStart('');
  };

  const handleEndDay = () => {
    if (!currentDayLog || !currentLocation) return;

    const distanceTraveled = odometerEnd && currentDayLog.odometerStart
      ? parseInt(odometerEnd) - currentDayLog.odometerStart
      : undefined;

    endDay(currentDayLog.id, {
      endTime: new Date(),
      endLocation: currentLocation,
      odometerEnd: odometerEnd ? parseInt(odometerEnd) : undefined,
      distanceTraveled,
    });

    setShowEndModal(false);
    setOdometerEnd('');
  };

  const quickActions = [
    { to: '/field/meetings', icon: MapPin, label: 'Log Meeting', color: 'bg-emerald-500', count: todayMeetings.length },
    { to: '/field/samples', icon: Package, label: 'Give Sample', color: 'bg-blue-500', count: todaySamples.length },
    { to: '/field/sales', icon: ShoppingCart, label: 'Record Sale', color: 'bg-purple-500', count: todaySales.length },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 relative z-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-gray-500">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Day Status Card */}
      <div className={`rounded-xl p-4 ${currentDayLog ? 'bg-emerald-50 border-2 border-emerald-200' : 'bg-amber-50 border-2 border-amber-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentDayLog ? (
              <>
                <div className="p-2 bg-emerald-500 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-800">Day In Progress</p>
                  <p className="text-sm text-emerald-600">
                    Started at {new Date(currentDayLog.startTime).toLocaleTimeString()}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="p-2 bg-amber-500 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-amber-800">Day Not Started</p>
                  <p className="text-sm text-amber-600">Start your day to begin logging activities</p>
                </div>
              </>
            )}
          </div>
          <div>
            {currentDayLog ? (
              <button
                onClick={() => setShowEndModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-base font-semibold min-h-[48px]"
              >
                <StopCircle className="w-5 h-5" />
                <span>End Day</span>
              </button>
            ) : (
              <button
                onClick={() => setShowStartModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-base font-semibold min-h-[48px]"
              >
                <PlayCircle className="w-5 h-5" />
                <span>Start Day</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Location Status */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${currentLocation ? 'bg-emerald-100' : 'bg-red-100'}`}>
            <Navigation className={`w-5 h-5 ${currentLocation ? 'text-emerald-600' : 'text-red-600'}`} />
          </div>
          <div>
            <p className="font-medium text-gray-800">
              {currentLocation ? 'Location Available' : 'Location Unavailable'}
            </p>
            {currentLocation && (
              <p className="text-sm text-gray-500">
                {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
              </p>
            )}
            {locationError && <p className="text-sm text-red-500">{locationError}</p>}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-4">
          {quickActions.map(action => (
            <Link
              key={action.to}
              to={action.to}
              className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center"
            >
              <div className={`${action.color} w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <p className="font-medium text-gray-800 text-sm">{action.label}</p>
              <p className="text-xs text-gray-500">Today: {action.count}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Today's Activity Summary */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Today's Activity</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {todayMeetings.length === 0 && todaySamples.length === 0 && todaySales.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No activities logged today</p>
            </div>
          ) : (
            <>
              {todayMeetings.map(meeting => (
                <div key={meeting.id} className="p-3 flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-800">
                      {meeting.type === 'one-on-one' ? meeting.personName : meeting.villageName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {meeting.type === 'one-on-one' ? 'One-on-One Meeting' : `Group Meeting (${meeting.attendeeCount} attendees)`}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(meeting.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              {todaySamples.map(sample => (
                <div key={sample.id} className="p-3 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-800">{sample.recipientName}</p>
                    <p className="text-xs text-gray-500">{sample.quantity}kg sample distributed</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(sample.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              {todaySales.map(sale => (
                <div key={sale.id} className="p-3 flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <ShoppingCart className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-800">{sale.customerName}</p>
                    <p className="text-xs text-gray-500">₹{sale.amount} ({sale.type})</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(sale.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Start Day Modal */}
      {showStartModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Start Your Day</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Location
                </label>
                <div className={`p-3 rounded-lg ${currentLocation ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                  {currentLocation
                    ? `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`
                    : 'Location not available'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Odometer Reading (Optional)
                </label>
                <input
                  type="number"
                  value={odometerStart}
                  onChange={e => setOdometerStart(e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="Enter current odometer reading"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowStartModal(false)}
                  className="flex-1 px-4 py-3 text-base border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium min-h-[48px]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartDay}
                  disabled={!currentLocation}
                  className="flex-1 px-4 py-3 text-base bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 font-semibold min-h-[48px]"
                >
                  Start Day
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* End Day Modal */}
      {showEndModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">End Your Day</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Location
                </label>
                <div className={`p-3 rounded-lg ${currentLocation ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                  {currentLocation
                    ? `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`
                    : 'Location not available'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Odometer Reading (Optional)
                </label>
                <input
                  type="number"
                  value={odometerEnd}
                  onChange={e => setOdometerEnd(e.target.value)}
                  className="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="Enter current odometer reading"
                />
                {currentDayLog?.odometerStart && odometerEnd && (
                  <p className="text-sm text-gray-500 mt-1">
                    Distance: {parseInt(odometerEnd) - currentDayLog.odometerStart} km
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEndModal(false)}
                  className="flex-1 px-4 py-3 text-base border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium min-h-[48px]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEndDay}
                  className="flex-1 px-4 py-3 text-base bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold min-h-[48px]"
                >
                  End Day
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
