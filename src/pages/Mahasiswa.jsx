import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import MahasiswaTable from '../components/mahasiswa/MahasiswaTable';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { Search } from 'lucide-react';

export default function Mahasiswa() {
  const { fetchPaSaya, loading } = useApi();
  const [data, setData] = useState(null);
  const [search, setSearch] = useState('');
  const [filterAngkatan, setFilterAngkatan] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const result = await fetchPaSaya();
    if (result?.data) {
      setData(result.data);
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (!data) return <div className="p-6 text-center text-gray-500">Gagal memuat data</div>;

  const mahasiswa = data.info_mahasiswa_pa.daftar_mahasiswa;
  const angkatanList = [...new Set(mahasiswa.map(m => m.angkatan))].sort();

  const filtered = mahasiswa.filter(m => {
    const matchSearch = m.nama.toLowerCase().includes(search.toLowerCase()) ||
                       m.nim.includes(search);
    const matchAngkatan = !filterAngkatan || m.angkatan === filterAngkatan;
    return matchSearch && matchAngkatan;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Daftar Mahasiswa</h1>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari nama atau NIM..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          />
        </div>
        <select
          value={filterAngkatan}
          onChange={(e) => setFilterAngkatan(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          <option value="">Semua Angkatan</option>
          {angkatanList.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      <MahasiswaTable 
        data={filtered} 
        onDetail={(nim) => navigate(`/mahasiswa/${nim}`)} 
      />
    </div>
  );
}