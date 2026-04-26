import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import SummaryCard from '../components/dashboard/SummaryCard';
import ActivityList from '../components/dashboard/ActivityList';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { Users, BookOpen, CheckCircle, Clock } from 'lucide-react';

export default function Dashboard() {
  const { fetchPaSaya, loading } = useApi();
  const [data, setData] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const result = await fetchPaSaya();
    if (result?.data) setData(result.data);
  };

  if (loading) return <LoadingSkeleton />;

  const mahasiswa = data?.info_mahasiswa_pa?.daftar_mahasiswa || [];
  const total = mahasiswa.length || 0;
  const sudahSetor = mahasiswa.filter(m => m?.info_setoran?.total_sudah_setor > 0).length || 0;
  const belumSetor = total - sudahSetor;
  const totalSetoran = mahasiswa.reduce((sum, m) => sum + (m?.info_setoran?.total_sudah_setor || 0), 0);

  return (
    <div className="space-y-4 lg:space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm lg:text-base text-gray-500 mt-1">
          Selamat datang, {data?.nama || 'Dosen'}
        </p>
      </div>

      {/* Summary Cards - 2 kolom di mobile, 4 kolom di desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <SummaryCard title="Total Mahasiswa" value={total} icon={Users} color="blue" subtitle="Bimbingan" />
        <SummaryCard title="Total Setoran" value={totalSetoran} icon={BookOpen} color="emerald" subtitle="Surah" />
        <SummaryCard title="Sudah Setor" value={sudahSetor} icon={CheckCircle} color="green" subtitle="Mahasiswa" />
        <SummaryCard title="Belum Setor" value={belumSetor} icon={Clock} color="orange" subtitle="Perlu perhatian" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <ActivityList data={data} />
      </div>
    </div>
  );
}