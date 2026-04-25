import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import MahasiswaInfo from '../components/mahasiswa/MahasiswaInfo';
import SurahList from '../components/mahasiswa/SurahList';
import SetoranForm from '../components/mahasiswa/SetoranForm';
import HistoryLog from '../components/mahasiswa/HistoryLog';
import Modal from '../components/ui/Modal';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { ArrowLeft } from 'lucide-react';

export default function MahasiswaDetail() {
  const { nim } = useParams();
  const navigate = useNavigate();
  const { fetchMahasiswaSetoran, submitSetoran, removeSetoran, loading } = useApi();
  const [data, setData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    loadData();
  }, [nim]);

  const loadData = async () => {
    const result = await fetchMahasiswaSetoran(nim);
    if (result?.data) {
      setData(result.data);
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
  if (!data) return <div className="p-6 text-center text-gray-500">Data tidak ditemukan</div>;

  return (
    <div className="p-6 space-y-6">
      <button
        onClick={() => navigate('/mahasiswa')}
        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Kembali
      </button>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Detail Mahasiswa</h1>
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
            <p>Yakin ingin menghapus setoran <strong>{deleteTarget.nama}</strong>?</p>
            <p className="text-sm text-gray-500">Surah: {deleteTarget.nama_arab}</p>
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
                Hapus
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}