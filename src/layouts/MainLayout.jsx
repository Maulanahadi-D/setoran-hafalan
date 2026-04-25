import { Outlet, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, BookOpen, BarChart3, Settings, LogOut, User 
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

  const handleLogout = async () => {
    await logout();
    authLogout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-emerald-600">Setoran Hafalan</h1>
          <p className="text-sm text-gray-500 mt-1">Panel Dosen</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
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
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Selamat datang, {user?.name || 'Dosen'}
              </h2>
              <p className="text-sm text-gray-500">Monitor setoran hafalan mahasiswa</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">{user?.name || 'Dosen'}</p>
                <p className="text-sm text-gray-500">Dosen PA</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}