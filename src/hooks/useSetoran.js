import { useState, useCallback } from 'react';
import { setoranService } from '../services/setoranService';
import { useToast } from '../context/ToastContext';

export const useSetoran = () => {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const getPaSaya = useCallback(async () => {
    setLoading(true);
    try {
      const response = await setoranService.getPaSaya();
      return response.data;
    } catch (error) {
      handleError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSetoranMahasiswa = useCallback(async (nim) => {
    setLoading(true);
    try {
      const response = await setoranService.getSetoranMahasiswa(nim);
      return response.data;
    } catch (error) {
      handleError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSetoran = useCallback(async (nim, data) => {
    setLoading(true);
    try {
      const response = await setoranService.saveSetoran(nim, data);
      addToast(response.data.message || 'Setoran berhasil disimpan!', 'success');
      return response.data;
    } catch (error) {
      handleError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSetoran = useCallback(async (nim, data) => {
    setLoading(true);
    try {
      const response = await setoranService.deleteSetoran(nim, data);
      addToast(response.data.message || 'Setoran berhasil dihapus!', 'success');
      return response.data;
    } catch (error) {
      handleError(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleError = (error) => {
    let message = 'Terjadi kesalahan';
    
    switch (error.response?.status) {
      case 400:
        message = error.response?.data?.message || 'Data duplikat atau tidak valid';
        break;
      case 401:
        message = 'Sesi berakhir, silakan login kembali';
        break;
      case 403:
        message = error.response?.data?.message || 'Anda tidak memiliki akses';
        break;
      case 404:
        message = error.response?.data?.message || 'Data tidak ditemukan';
        break;
      default:
        message = error.response?.data?.message || 'Terjadi kesalahan server';
    }
    
    addToast(message, 'error');
  };

  return { loading, getPaSaya, getSetoranMahasiswa, saveSetoran, deleteSetoran };
};