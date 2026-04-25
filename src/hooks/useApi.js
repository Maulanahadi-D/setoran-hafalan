import { useState, useCallback } from 'react';
import { setoranService } from '../services/setoran';
import { useToast } from '../context/ToastContext';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleError = useCallback((error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    const url = error.config?.url;

    console.error('❌ API Error:', {
      url,
      status,
      message,
      data: error.response?.data
    });

    switch (status) {
      case 400:
        addToast(message || 'Data sudah ada atau tidak valid', 'error');
        break;
      case 401:
        addToast('Sesi berakhir, mencoba refresh...', 'warning');
        break;
      case 403:
        addToast(message || 'Anda tidak memiliki akses', 'error');
        break;
      case 404:
        addToast(message || 'Data tidak ditemukan', 'error');
        break;
      default:
        addToast(message || 'Terjadi kesalahan server', 'error');
    }
    return null;
  }, [addToast]);

  const fetchPaSaya = useCallback(async () => {
    setLoading(true);
    try {
      console.log('🔍 Fetching /pa-saya...');
      const response = await setoranService.getPaSaya();
      console.log('✅ /pa-saya response:', response.data);
      return response.data;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const fetchMahasiswaSetoran = useCallback(async (nim) => {
    setLoading(true);
    try {
      console.log(`🔍 Fetching /mahasiswa/setoran/${nim}...`);
      const response = await setoranService.getMahasiswaSetoran(nim);
      console.log(`✅ /mahasiswa/setoran/${nim} response:`, response.data);
      return response.data;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const submitSetoran = useCallback(async (nim, data) => {
    setLoading(true);
    try {
      console.log(`🔍 POST /mahasiswa/setoran/${nim}`, data);
      const response = await setoranService.saveSetoran(nim, data);
      console.log('✅ POST response:', response.data);
      addToast(response.data.message || 'Setoran berhasil disimpan! ✨', 'success');
      return response.data;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  }, [handleError, addToast]);

  const removeSetoran = useCallback(async (nim, data) => {
    setLoading(true);
    try {
      console.log(`🔍 DELETE /mahasiswa/setoran/${nim}`, data);
      const response = await setoranService.deleteSetoran(nim, data);
      console.log('✅ DELETE response:', response.data);
      addToast(response.data.message || 'Setoran berhasil dihapus!', 'success');
      return response.data;
    } catch (error) {
      return handleError(error);
    } finally {
      setLoading(false);
    }
  }, [handleError, addToast]);

  return {
    loading,
    fetchPaSaya,
    fetchMahasiswaSetoran,
    submitSetoran,
    removeSetoran
  };
};