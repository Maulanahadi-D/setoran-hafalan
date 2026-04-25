import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginService } from '../services/auth';
import { useAuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const { setUser, setIsAuthenticated } = useAuthContext();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const login = async (username, password) => {
    setLoading(true);
    try {
      const userData = await loginService(username, password);
      setUser(userData);
      setIsAuthenticated(true);
      addToast('Login berhasil! Selamat datang.', 'success');
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Login gagal. Periksa kredensial.';
      addToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};