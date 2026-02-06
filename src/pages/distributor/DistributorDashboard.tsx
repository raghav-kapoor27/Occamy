import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle,
  LogOut,
} from 'lucide-react';

export function DistributorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { samples, sales } = useData();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Filter data for this distributor
  const distributorSamples = useMemo(
    () => samples.filter((s) => s.userId === user?.id),
    [samples, user?.id]
  );
  const distributorSales = useMemo(
    () => sales.filter((s) => s.userId === user?.id),
    [sales, user?.id]
  );

  const todaySamples = distributorSamples.filter(
    (s) => new Date(s.date).toDateString() === new Date().toDateString()
  );
  const todaySales = distributorSales.filter(
    (s) => new Date(s.date).toDateString() === new Date().toDateString()
  );

  const totalSamples = distributorSamples.reduce(
    (sum, s) => sum + s.quantity,
    0
  );
  const totalSales = distributorSales.reduce((sum, s) => sum + s.amount, 0);
  const totalVolume = distributorSales.reduce((sum, s) => sum + s.quantity, 0);

  const quickActions = [
    {
      to: '/distributor/inventory',
      icon: Package,
      label: 'Manage Inventory',
      color: 'bg-blue-500',
      count: totalSamples,
    },
    {
      to: '/distributor/sales',
      icon: ShoppingCart,
      label: 'View Sales',
      color: 'bg-emerald-500',
      count: distributorSales.length,
    },
    {
      to: '/distributor/analytics',
      icon: TrendingUp,
      label: 'Analytics',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 relative z-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Welcome, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 mt-1">
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{totalSamples}</p>
              <p className="text-xs text-gray-500">Total Samples</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                ₹{(totalSales / 1000).toFixed(1)}K
              </p>
              <p className="text-xs text-gray-500">Total Sales</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{totalVolume}</p>
              <p className="text-xs text-gray-500">Units Sold</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {distributorSales.length}
              </p>
              <p className="text-xs text-gray-500">Transactions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.to}
                to={action.to}
                className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center min-h-[120px] flex flex-col items-center justify-center"
              >
                <div
                  className={`${action.color} w-14 h-14 rounded-xl mb-3 flex items-center justify-center`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <p className="font-semibold text-gray-800 text-base mb-1">
                  {action.label}
                </p>
                {action.count !== undefined && (
                  <p className="text-sm text-gray-500">
                    {action.count} {action.label.includes('Sales') ? 'orders' : 'items'}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Today's Activity */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800 text-lg">Today's Activity</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {todaySamples.length === 0 && todaySales.length === 0 ? (
            <div className="p-8 md:p-12 text-center text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-base">No activities today</p>
              <p className="text-sm text-gray-400 mt-1">
                Start managing your inventory and sales
              </p>
            </div>
          ) : (
            <>
              {todaySamples.map((sample) => (
                <div
                  key={sample.id}
                  className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {sample.recipientName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {sample.quantity}kg sample distributed
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {sample.location.address}
                    </p>
                  </div>
                  <span className="text-sm text-gray-400">
                    {new Date(sample.date).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))}
              {todaySales.map((sale) => (
                <div
                  key={sale.id}
                  className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <ShoppingCart className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {sale.customerName}
                    </p>
                    <p className="text-sm text-gray-600">
                      ₹{sale.amount.toLocaleString()} • {sale.quantity} units
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {sale.location.address}
                    </p>
                  </div>
                  <span className="text-sm text-gray-400">
                    {new Date(sale.date).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
