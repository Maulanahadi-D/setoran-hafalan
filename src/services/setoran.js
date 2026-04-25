import api from './api';

const BASE = '/setoran-dev/v1';

export const setoranService = {
  // Get lecturer's students
  getPaSaya: () => api.get(`${BASE}/dosen/pa-saya`),

  // Get student detail with memorization data
  getMahasiswaSetoran: (nim) => api.get(`${BASE}/mahasiswa/setoran/${nim}`),

  // Save memorization (supports multiple surah)
  saveSetoran: (nim, data) => api.post(`${BASE}/mahasiswa/setoran/${nim}`, data),

  // Delete memorization
  deleteSetoran: (nim, data) => api.delete(`${BASE}/mahasiswa/setoran/${nim}`, { data })
};