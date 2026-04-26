import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import MahasiswaTable from '../components/mahasiswa/MahasiswaTable';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { Search, RefreshCw } from 'lucide-react';

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
    if (result?.data) setData(result.data);
  };

  if (loading && !data) return <LoadingSkeleton />;

  const mahasiswa = data?.info_mahasiswa_pa?.daftar_mahasiswa || [];
  const angkatanList = [...new Set(mahasiswa.map(m => m.angkatan))].sort();

  const filtered = mahasiswa.filter(m => {
    const matchSearch = m.nama.toLowerCase().includes(search.toLowerCase()) || m.nim.includes(search);
    const matchAngkatan = !filterAngkatan || m.angkatan === filterAngkatan;
    return matchSearch && matchAngkatan;
  });

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-800">Daftar Mahasiswa</h1>
          <p className="text-sm text-gray-500">Total: {mahasiswa.length} mahasiswa</p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center px-3 lg:px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
        >
          <RefreshCw className={`w-4 h-4 mr-1 lg:mr-2 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Search & Filter - Stack di mobile, row di desktop */}
      <div className="flex flex-col sm:flex-row gap-2 lg:gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 lg:w-5 lg:h-5" />
          <input
            type="text"
            placeholder="Cari nama atau NIM..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 lg:pl-10 pr-3 py-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <select
          value={filterAngkatan}
          onChange={(e) => setFilterAngkatan(e.target.value)}
          className="px-3 py-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          <option value="">Semua Angkatan</option>
          {angkatanList.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 lg:p-12 text-center">
          <Search className="w-12 h-12 lg:w-16 lg:h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Tidak ada mahasiswa yang cocok</p>
        </div>
      ) : (
        <MahasiswaTable data={filtered} onDetail={(nim) => navigate(`/mahasiswa/${nim}`)} />
      )}
    </div>
  );
}