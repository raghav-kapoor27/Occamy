import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
  Home,
  Users,
  MapPin,
  Package,
  ShoppingCart,
  BarChart3,
  Menu,
  X,
  LogOut,
  User,
  PlayCircle,
  StopCircle,
} from 'lucide-react';
import { AuroraBackground } from './nature';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout, hasRole } = useAuth();
  const { currentDayLog } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdmin = hasRole(['admin']);

  const isFieldOfficer = hasRole(['field_officer']);
  const isDistributor = hasRole(['distributor']);

  const adminLinks = [
    { to: '/admin', icon: Home, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/meetings', icon: MapPin, label: 'Meetings' },
    { to: '/admin/samples', icon: Package, label: 'Samples' },
    { to: '/admin/sales', icon: ShoppingCart, label: 'Sales' },
    { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  const fieldLinks = [
    { to: '/field', icon: Home, label: 'Dashboard' },
    { to: '/field/meetings', icon: MapPin, label: 'Log Meeting' },
    { to: '/field/samples', icon: Package, label: 'Distribute Sample' },
    { to: '/field/sales', icon: ShoppingCart, label: 'Record Sale' },
  ];

  const distributorLinks = [
    { to: '/distributor', icon: Home, label: 'Dashboard' },
    { to: '/distributor/inventory', icon: Package, label: 'Inventory' },
    { to: '/distributor/sales', icon: ShoppingCart, label: 'Sales' },
    { to: '/distributor/analytics', icon: BarChart3, label: 'Analytics' },
  ];

  const links = isAdmin
    ? adminLinks
    : isFieldOfficer
    ? fieldLinks
    : isDistributor
    ? distributorLinks
    : [];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <AuroraBackground className="min-h-screen">
      {/* Top-level flex container ensures sidebar and content share the same vertical space */}
      <div className="min-h-screen flex items-stretch bg-gray-50/80 backdrop-blur-sm">

        {/* Mobile header (unchanged) */}
        <div className="lg:hidden bg-emerald-700/95 backdrop-blur-md text-white p-4 flex items-center justify-between relative z-50 w-full">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <img src="https://i.ibb.co/LDBc15Qp/Whats-App-Image-2026-02-06-at-11-16-41-PM-1.jpg" alt="Occamy Bioscience Logo" className="w-10 h-10 object-contain" />
          <div className="w-6" />
        </div>

        {/* Mobile sidebar overlay (keeps behavior) */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar: removed `fixed` and `h-screen`, use sticky so it stays visible while scrolling */}
        <aside
          className={`hidden lg:flex w-64 flex-col bg-emerald-700/95 backdrop-blur-md text-white z-10 transform transition-transform ${
            sidebarOpen ? 'translate-x-0' : ''
          }`}
        >
          {/* Keep header/profile section as before */}
          <div className="p-4 flex items-center justify-between border-b border-emerald-600 flex-shrink-0">
            <div className="flex items-center gap-2">
              <img src="https://i.ibb.co/LDBc15Qp/Whats-App-Image-2026-02-06-at-11-16-41-PM-1.jpg" alt="Occamy Bioscience Logo" className="w-12 h-12 object-contain" />
              <span className="font-bold text-lg">Occamy</span>
            </div>
          </div>

          <div className="p-4 border-b border-emerald-600 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-sm">{user?.name}</p>
                <p className="text-xs text-emerald-200 capitalize">{user?.role.replace('_', ' ')}</p>
              </div>
            </div>
            {isFieldOfficer && (
              <div className="mt-3">
                {currentDayLog ? (
                  <div className="flex items-center gap-2 text-xs bg-emerald-600 px-2 py-1 rounded">
                    <StopCircle className="w-4 h-4 text-red-300" />
                    <span>Day Started</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs bg-emerald-800 px-2 py-1 rounded">
                    <PlayCircle className="w-4 h-4 text-yellow-300" />
                    <span>Day Not Started</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation: make it take remaining space and scroll internally if necessary */}
          <nav className="p-4 space-y-1 flex-1 overflow-y-auto sticky top-0 self-start">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === link.to
                    ? 'bg-emerald-600 text-white'
                    : 'text-emerald-100 hover:bg-emerald-600/50'
                }`}
              >
                <link.icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Mobile sidebar rendered for smaller screens (slide-in) */}
        <aside className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-emerald-700/95 z-50 transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4 flex items-center justify-between border-b border-emerald-600 flex-shrink-0">
            <div className="flex items-center gap-2">
              <img src="https://i.ibb.co/LDBc15Qp/Whats-App-Image-2026-02-06-at-11-16-41-PM-1.jpg" alt="Occamy Bioscience Logo" className="w-12 h-12 object-contain" />
              <span className="font-bold text-lg">Occamy</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 border-b border-emerald-600">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-sm">{user?.name}</p>
                <p className="text-xs text-emerald-200 capitalize">{user?.role.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
          <nav className="p-4 space-y-1 overflow-y-auto">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === link.to
                    ? 'bg-emerald-600 text-white'
                    : 'text-emerald-100 hover:bg-emerald-600/50'
                }`}
              >
                <link.icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content: flexible and will scroll naturally; sidebar is part of layout and sticky */}
        <main className="flex-1 overflow-auto relative z-0">
          {children}
        </main>
      </div>
    </AuroraBackground>
  );
}
