import { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, BookOpen, BarChart3, Settings, 
  LogOut, User, Menu, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';

const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/mahasiswa', icon: Users, label: 'Mahasiswa' },
  { path: '/setoran', icon: BookOpen, label: 'Setoran' },
  { path: '/rekap', icon: BarChart3, label: 'Rekap' },
  { path: '/pengaturan', icon: Settings, label: 'Pengaturan' }
];

export default function MainLayout() {
  const { user, logout: authLogout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    authLogout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Overlay untuk mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-emerald-600">Setoran Hafalan</h1>
            <p className="text-sm text-gray-500 mt-1">Panel Dosen</p>
          </div>
          {/* Close button mobile */}
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 lg:py-4 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              {/* Hamburger menu button - mobile only */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-sm lg:text-lg font-semibold text-gray-800">
                  Selamat datang, {user?.name || 'Dosen'}
                </h2>
                <p className="text-xs lg:text-sm text-gray-500 hidden sm:block">
                  Monitor setoran hafalan mahasiswa
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 lg:w-6 lg:h-6 text-emerald-600" />
              </div>
              <div className="hidden sm:block">
                <p className="font-medium text-gray-800 text-sm lg:text-base">{user?.name || 'Dosen'}</p>
                <p className="text-xs lg:text-sm text-gray-500">Dosen PA</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-3 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}