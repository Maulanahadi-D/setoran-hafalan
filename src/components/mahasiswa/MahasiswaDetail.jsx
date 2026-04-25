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
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    loadData();
  }, [nim]);

  const loadData = async () => {
    setError(null);
    console.log(`🔍 Fetching data untuk NIM: ${nim}`);
    
    const result = await fetchMahasiswaSetoran(nim);
    
    if (result?.data) {
      console.log('✅ Data diterima:', result.data);
      console.log('📊 Progress:', result.data.setoran.info_dasar);
      console.log('📝 Total sudah setor:', result.data.setoran.info_dasar.total_sudah_setor);
      console.log('📝 Total wajib setor:', result.data.setoran.info_dasar.total_wajib_setor);
      console.log('📝 Persentase:', result.data.setoran.info_dasar.persentase_progres_setor);
      
      // Validasi data
      const info = result.data.setoran.info_dasar;
      if (info.total_sudah_setor === 0 && info.persentase_progres_setor > 0) {
        console.warn('⚠️ Data tidak konsisten: sudah_setor=0 tapi progress>0');
      }
      
      setData(result.data);
    } else {
      console.error('❌ Gagal mengambil data');
      setError('Gagal mengambil data mahasiswa');
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

  if (loading && !data) return <LoadingSkeleton />;
  
  if (error) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate('/mahasiswa')}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali
        </button>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-red-800 font-medium">{error}</p>
          <button
            onClick={loadData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate('/mahasiswa')}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali
        </button>
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Data tidak ditemukan</p>
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

      {showForm && (
        <Modal onClose={() => setShowForm(false)} title="Input Setoran Baru">
          <SetoranForm
            detail={data.setoran.detail}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </Modal>
      )}

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
              <p className="text-sm text-gray-500">ID: {deleteTarget.id}</p>
            </div>
            <p className="text-sm text-gray-600">
              Tindakan ini tidak dapat dibatalkan. Lanjutkan?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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