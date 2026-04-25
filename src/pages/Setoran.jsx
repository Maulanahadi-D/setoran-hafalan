import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import { BookOpen, Users, TrendingUp, RefreshCw } from 'lucide-react';

export default function Setoran() {
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
  const today = new Date().toISOString().split('T')[0];
  
  // Yang setor hari ini
  const setoranHariIni = mahasiswa.filter(m => 
    m?.info_setoran?.tgl_terakhir_setor === today
  );

  // ✅ PERBAIKAN: Hitung rata-rata dengan aman
  const hitungRataRata = () => {
    // Filter mahasiswa yang SUDAH setor (progress > 0)
    const yangSudahSetor = mahasiswa.filter(
      m => m?.info_setoran?.total_sudah_setor > 0
    );
    
    // Jika tidak ada yang setor, return 0
    if (yangSudahSetor.length === 0) return 0;
    
    // Jumlahkan semua progress
    const totalProgress = yangSudahSetor.reduce(
      (sum, m) => sum + (m?.info_setoran?.persentase_progres_setor || 0),
      0
    );
    
    // Hitung rata-rata
    const rataRata = totalProgress / yangSudahSetor.length;
    
    // ✅ Cegah NaN: jika hasil bukan number, return 0
    return isNaN(rataRata) ? 0 : rataRata;
  };

  const rataRataProgress = hitungRataRata();

  // Debug
  console.log('📊 Setoran Stats:', {
    totalMahasiswa: mahasiswa.length,
    setoranHariIni: setoranHariIni.length,
    rataRata: rataRataProgress,
    sampleData: mahasiswa.slice(0, 3).map(m => ({
      nama: m.nama,
      progress: m?.info_setoran?.persentase_progres_setor,
      sudahSetor: m?.info_setoran?.total_sudah_setor
    }))
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Setoran Hari Ini</h1>
        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Setoran Hari Ini</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">
                {setoranHariIni.length}
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <BookOpen className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Mahasiswa</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {mahasiswa.length}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Rata-rata Progress</p>
              {/* ✅ PERBAIKAN: Tampilkan dengan aman */}
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {rataRataProgress.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Monitoring Setoran */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Monitoring Setoran
        </h2>
        
        {mahasiswa.filter(m => m?.info_setoran?.total_sudah_setor > 0).length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>Belum ada mahasiswa yang setor</p>
          </div>
        ) : (
          <div className="space-y-2">
            {mahasiswa
              .filter(m => m?.info_setoran?.total_sudah_setor > 0)
              .sort((a, b) => (b?.info_setoran?.persentase_progres_setor || 0) - (a?.info_setoran?.persentase_progres_setor || 0))
              .slice(0, 10)
              .map((m) => (
                <div 
                  key={m.nim} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{m.nama}</p>
                    <p className="text-sm text-gray-500">{m.nim}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    {/* Mini progress bar */}
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          (m?.info_setoran?.persentase_progres_setor || 0) >= 70
                            ? 'bg-emerald-500'
                            : (m?.info_setoran?.persentase_progres_setor || 0) >= 30
                              ? 'bg-yellow-500'
                              : 'bg-orange-500'
                        }`}
                        style={{ width: `${m?.info_setoran?.persentase_progres_setor || 0}%` }}
                      />
                    </div>
                    <span className="font-medium text-emerald-600 w-16 text-right">
                      {m?.info_setoran?.persentase_progres_setor || 0}%
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}