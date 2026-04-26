import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Mahasiswa from './pages/Mahasiswa';
import MahasiswaDetail from './pages/MahasiswaDetail';
import Setoran from './pages/Setoran';
import Rekap from './pages/Rekap';
import Pengaturan from './pages/Pengaturan';
import NotFound from './pages/NotFound'; // ← TAMBAHKAN INI

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <MainLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="mahasiswa" element={<Mahasiswa />} />
              <Route path="mahasiswa/:nim" element={<MahasiswaDetail />} />
              <Route path="setoran" element={<Setoran />} />
              <Route path="rekap" element={<Rekap />} />
              <Route path="pengaturan" element={<Pengaturan />} />
              
              {/* ✅ TAMBAHKAN ROUTE 404 */}
              <Route path="*" element={<NotFound />} />
            </Route>
            
            {/* ✅ 404 untuk halaman di luar layout (sebelum login) */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}