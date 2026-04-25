import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import SummaryCard from '../components/dashboard/SummaryCard';
import ActivityList from '../components/dashboard/ActivityList';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { Users, BookOpen, CheckCircle, Clock, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { fetchPaSaya, loading } = useApi();
  const [data, setData] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const result = await fetchPaSaya();
    console.log('📊 Dashboard data received:', result);
    
    // ✅ PERBAIKAN: Validasi data sebelum disimpan
    if (result?.data) {
      setData(result.data);
    } else if (result?.response === false) {
      // API return error
      console.error('API returned error:', result?.message);
      setData(null);
    } else {
      console.warn('No data in response');
      setData(null);
    }
  };

  if (loading) return <LoadingSkeleton />;
  
  if (!data) {
    return (
      <div className="p-6 text-center">
        <div className="bg-white rounded-xl shadow-sm p-12">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Tidak ada data</p>
          <p className="text-gray-400 text-sm mt-2">Silakan refresh halaman</p>
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

  // ✅ PERBAIKAN: Ambil data dengan aman + default value
  const infoMahasiswa = data?.info_mahasiswa_pa || {};
  const mahasiswa = infoMahasiswa.daftar_mahasiswa || [];
  
  // ✅ PERBAIKAN: Hitung dengan aman
  const total = mahasiswa.length || 0;
  const sudahSetor = mahasiswa.filter(m => 
    m?.info_setoran?.total_sudah_setor > 0
  ).length || 0;
  const belumSetor = total - sudahSetor;
  const totalSetoran = mahasiswa.reduce((sum, m) => 
    sum + (m?.info_setoran?.total_sudah_setor || 0), 0
  );

  const namaDosen = data?.nama || 'Dosen';

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Selamat datang, {namaDosen}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard 
          title="Total Mahasiswa" 
          value={total} 
          icon={Users} 
          color="blue"
          subtitle="Mahasiswa bimbingan"
        />
        <SummaryCard 
          title="Total Setoran" 
          value={totalSetoran} 
          icon={BookOpen} 
          color="emerald"
          subtitle="Total surah tervalidasi"
        />
        <SummaryCard 
          title="Sudah Setor" 
          value={sudahSetor} 
          icon={CheckCircle} 
          color="green"
          subtitle={total > 0 ? `${Math.round((sudahSetor / total) * 100)}% mahasiswa` : '0%'}
        />
        <SummaryCard 
          title="Belum Setor" 
          value={belumSetor} 
          icon={Clock} 
          color="orange"
          subtitle="Perlu perhatian"
        />
      </div>

      {/* Activity List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityList data={data} />
      </div>
    </div>
  );
}