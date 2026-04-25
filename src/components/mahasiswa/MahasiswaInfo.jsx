export default function MahasiswaInfo({ info, setoran }) {
  const { info_dasar } = setoran;
  const progress = info_dasar.persentase_progres_setor;
  const sudahSetor = info_dasar.total_sudah_setor;
  const wajibSetor = info_dasar.total_wajib_setor;
  const belumSetor = info_dasar.total_belum_setor;

  // PERBAIKAN: Validasi konsistensi data
  const isValid = sudahSetor + belumSetor === wajibSetor;
  
  // Hitung ulang progress jika data tidak valid
  const calculatedProgress = wajibSetor > 0 
    ? Math.round((sudahSetor / wajibSetor) * 100) 
    : 0;
  
  // Gunakan progress yang valid
  const displayProgress = sudahSetor === 0 ? 0 : progress;

  const getProgressColor = (value) => {
    if (value === 0) return 'bg-gray-300';
    if (value < 30) return 'bg-orange-500';
    if (value < 70) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };

  const getProgressTextColor = (value) => {
    if (value === 0) return 'text-gray-400';
    if (value < 30) return 'text-orange-600';
    if (value < 70) return 'text-yellow-600';
    return 'text-emerald-600';
  };

  const getStatusBadge = () => {
    if (sudahSetor === 0) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
          Belum Ada Setoran
        </span>
      );
    }
    if (displayProgress >= 100 || sudahSetor >= wajibSetor) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
          Lunas ✓
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
        {sudahSetor}/{wajibSetor} Surah • {displayProgress}%
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Info Mahasiswa */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Informasi Mahasiswa</h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Nama</p>
            <p className="font-medium text-gray-800">{info.nama}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">NIM</p>
            <p className="font-medium text-gray-800">{info.nim}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-800 text-sm">{info.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Dosen PA</p>
            <p className="font-medium text-gray-800">{info.dosen_pa.nama}</p>
          </div>
          <div className="pt-2">
            {getStatusBadge()}
            {!isValid && (
              <p className="text-xs text-orange-500 mt-2">
                ⚠️ Data mungkin tidak konsisten, refresh halaman
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Progress Setoran */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Progress Setoran</h2>
          <span className={`text-2xl font-bold ${getProgressTextColor(displayProgress)}`}>
            {displayProgress}%
          </span>
        </div>
        
        {/* Progress Bar Besar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-5">
            <div
              className={`h-5 rounded-full transition-all duration-700 ${getProgressColor(displayProgress)}`}
              style={{ width: `${displayProgress === 0 ? 0 : displayProgress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-400">0%</span>
            <span className="text-xs text-gray-400">50%</span>
            <span className="text-xs text-gray-400">100%</span>
          </div>
          {sudahSetor === 0 && (
            <div className="mt-3 bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-500">
                📋 Mahasiswa belum melakukan setoran
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Klik "Input Setoran" untuk memulai
              </p>
            </div>
          )}
        </div>

        {/* Detail Angka */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Wajib Setor</p>
            <p className="text-2xl font-bold text-gray-800">{wajibSetor}</p>
            <p className="text-xs text-gray-400 mt-1">Total surah</p>
          </div>
          <div className={`p-4 rounded-lg ${
            sudahSetor === 0 ? 'bg-gray-50' : 'bg-emerald-50'
          }`}>
            <p className="text-sm text-gray-500">Sudah Setor</p>
            <p className={`text-2xl font-bold ${
              sudahSetor === 0 ? 'text-gray-400' : 'text-emerald-600'
            }`}>
              {sudahSetor}
            </p>
            <p className="text-xs text-gray-400 mt-1">Surah tervalidasi</p>
          </div>
          <div className={`p-4 rounded-lg ${
            belumSetor === 0 ? 'bg-emerald-50' : 'bg-orange-50'
          }`}>
            <p className="text-sm text-gray-500">Belum Setor</p>
            <p className={`text-2xl font-bold ${
              belumSetor === 0 ? 'text-emerald-600' : 'text-orange-600'
            }`}>
              {belumSetor}
            </p>
            <p className="text-xs text-gray-400 mt-1">Surah tersisa</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Terakhir Setor</p>
            <p className="text-lg font-bold text-blue-600">
              {info_dasar.terakhir_setor || 'Belum ada'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {info_dasar.tgl_terakhir_setor ? 
                new Date(info_dasar.tgl_terakhir_setor).toLocaleDateString('id-ID') : 
                '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}