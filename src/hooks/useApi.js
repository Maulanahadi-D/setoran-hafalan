import { useState, useCallback } from 'react';
import { setoranService } from '../services/setoran';
import { useToast } from '../context/ToastContext';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleError = useCallback((error, customMessage) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || customMessage;

    console.error('❌ API Error:', { status, message });

    switch (status) {
      case 400:
        if (message?.includes('udah tercatat') || message?.includes('duplikat')) {
          addToast('⚠️ Setoran sudah ada sebelumnya!', 'warning');
        } else {
          addToast(message || 'Data tidak valid', 'error');
        }
        break;
      case 401:
        addToast('Sesi berakhir, silakan login kembali', 'error');
        break;
      case 403:
        addToast(message || 'Anda tidak memiliki akses!', 'error');
        break;
      case 404:
        addToast(message || 'Data tidak ditemukan', 'error');
        break;
      case 408:
        addToast('Server tidak merespon. Coba lagi.', 'error');
        break;
      case 500:
        addToast('Server error. Silakan coba beberapa saat lagi.', 'error');
        break;
      default:
        if (message) {
          addToast(message, 'error');
        }
    }

    return null;
  }, [addToast]);

  const fetchPaSaya = useCallback(async () => {
    setLoading(true);
    try {
      const response = await setoranService.getPaSaya();
      return response.data;
    } catch (error) {
      return handleError(error, 'Gagal memuat data mahasiswa');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const fetchMahasiswaSetoran = useCallback(async (nim) => {
    setLoading(true);
    try {
      const response = await setoranService.getMahasiswaSetoran(nim);
      return response.data;
    } catch (error) {
      return handleError(error, `Gagal memuat data mahasiswa ${nim}`);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const submitSetoran = useCallback(async (nim, data) => {
    setLoading(true);
    try {
      const response = await setoranService.saveSetoran(nim, data);
      addToast(response.data?.message || 'Setoran berhasil disimpan! ✨', 'success');
      return response.data;
    } catch (error) {
      return handleError(error, 'Gagal menyimpan setoran');
    } finally {
      setLoading(false);
    }
  }, [handleError, addToast]);

  const removeSetoran = useCallback(async (nim, data) => {
    setLoading(true);
    try {
      const response = await setoranService.deleteSetoran(nim, data);
      addToast(response.data?.message || 'Setoran berhasil dihapus!', 'success');
      return response.data;
    } catch (error) {
      return handleError(error, 'Gagal menghapus setoran');
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