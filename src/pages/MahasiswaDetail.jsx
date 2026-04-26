import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import MahasiswaInfo from '../components/mahasiswa/MahasiswaInfo';
import SurahList from '../components/mahasiswa/SurahList';
import SetoranForm from '../components/mahasiswa/SetoranForm';
import HistoryLog from '../components/mahasiswa/HistoryLog';
import Modal from '../components/ui/Modal';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function MahasiswaDetail() {
  const { nim } = useParams();
  const navigate = useNavigate();
  const { fetchMahasiswaSetoran, submitSetoran, removeSetoran, loading } = useApi();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    loadData();
  }, [nim]);

  const loadData = async () => {
    setError(null);
    setLoadError(null);
    
    const result = await fetchMahasiswaSetoran(nim);
    
    if (result?.data) {
      setData(result.data);
      setError(null);
      setLoadError(null);
    } else if (result === null) {
      // API error sudah di-handle oleh hook
      setLoadError('Data mahasiswa tidak ditemukan');
      setData(null);
    } else {
      setLoadError('Gagal memuat data');
      setData(null);
    }
  };

  const handleSubmit = async (formData) => {
    const result = await submitSetoran(nim, formData);
    if (result) {
      setShowForm(false);
      loadData();
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const payload = {
      data_setoran: [{
        id: deleteTarget.info_setoran.id,
        id_komponen_setoran: deleteTarget.id,
        nama_komponen_setoran: deleteTarget.nama
      }]
    };
    const result = await removeSetoran(nim, payload);
    if (result) {
      setDeleteTarget(null);
      loadData();
    }
  };

  // Loading state
  if (loading && !data) {
    return (
      <div className="p-6">
        <LoadingSkeleton />
      </div>
    );
  }

  // Error state
  if (loadError && !data) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate('/mahasiswa')}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali ke Daftar
        </button>

        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Data Tidak Ditemukan
          </h2>
          <p className="text-gray-500 mb-6">{loadError}</p>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={loadData}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Coba Lagi
            </button>
            <button
              onClick={() => navigate('/mahasiswa')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Data kosong
  if (!data) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate('/mahasiswa')}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali ke Daftar
        </button>

        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Data tidak tersedia</p>
          <button
            onClick={loadData}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // Data berhasil dimuat
  return (
    <div className="p-6 space-y-6">
      <button
        onClick={() => navigate('/mahasiswa')}
        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Kembali ke Daftar
      </button>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Detail Mahasiswa</h1>
          <p className="text-sm text-gray-500 mt-1">NIM: {nim}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Input Setoran
        </button>
      </div>

      <MahasiswaInfo info={data.info} setoran={data.setoran} />

      <SurahList
        detail={data.setoran.detail}
        onDelete={(surah) => setDeleteTarget(surah)}
      />

      <HistoryLog log={data.setoran.log} />

      {/* Modal Input Setoran */}
      {showForm && (
        <Modal onClose={() => setShowForm(false)} title="Input Setoran Baru">
          <SetoranForm
            detail={data.setoran.detail}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </Modal>
      )}

      {/* Modal Konfirmasi Hapus */}
      {deleteTarget && (
        <Modal onClose={() => setDeleteTarget(null)} title="Konfirmasi Hapus">
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                ⚠️ Anda akan menghapus setoran untuk:
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium text-gray-800">{deleteTarget.nama}</p>
              <p className="text-sm text-gray-500 mt-1">{deleteTarget.nama_arab}</p>
            </div>
            <p className="text-sm text-gray-600">
              Tindakan ini tidak dapat dibatalkan. Lanjutkan?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}