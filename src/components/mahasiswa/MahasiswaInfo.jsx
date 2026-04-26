export default function MahasiswaInfo({ info, setoran }) {
  const { info_dasar } = setoran;
  const progress = info_dasar.persentase_progres_setor || 0;
  const sudahSetor = info_dasar.total_sudah_setor || 0;
  const wajibSetor = info_dasar.total_wajib_setor || 0;
  const belumSetor = info_dasar.total_belum_setor || 0;

  // ✅ Tentukan state
  const getState = () => {
    if (sudahSetor === 0) return 'EMPTY';
    if (sudahSetor >= wajibSetor) return 'FULL';
    return 'PARTIAL';
  };
  const state = getState();

  // ✅ Konfigurasi berdasarkan state
  const config = {
    EMPTY: {
      barColor: 'bg-gray-300',
      textColor: 'text-gray-400',
      width: '0%',
      label: 'Belum Ada Setoran',
      badgeClass: 'bg-gray-100 text-gray-600',
    },
    PARTIAL: {
      barColor: progress < 30 ? 'bg-orange-500' : progress < 70 ? 'bg-yellow-500' : 'bg-emerald-500',
      textColor: progress < 30 ? 'text-orange-600' : progress < 70 ? 'text-yellow-600' : 'text-emerald-600',
      width: `${progress}%`,
      label: `${sudahSetor}/${wajibSetor} Surah • ${progress}%`,
      badgeClass: 'bg-yellow-100 text-yellow-800',
    },
    FULL: {
      barColor: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      width: '100%',
      label: 'Lunas ✓',
      badgeClass: 'bg-emerald-100 text-emerald-800',
    },
  };
  const c = config[state];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      
      {/* KIRI: Informasi Mahasiswa */}
      <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Informasi Mahasiswa</h2>
        <div className="space-y-3">
          <div>
            <p className="text-xs lg:text-sm text-gray-500">Nama</p>
            <p className="font-medium text-gray-800 text-sm lg:text-base">{info.nama}</p>
          </div>
          <div>
            <p className="text-xs lg:text-sm text-gray-500">NIM</p>
            <p className="font-medium text-gray-800 text-sm lg:text-base">{info.nim}</p>
          </div>
          <div>
            <p className="text-xs lg:text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-800 text-xs lg:text-sm break-all">{info.email}</p>
          </div>
          <div>
            <p className="text-xs lg:text-sm text-gray-500">Dosen PA</p>
            <p className="font-medium text-gray-800 text-sm lg:text-base">{info.dosen_pa.nama}</p>
          </div>
          <div className="pt-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${c.badgeClass}`}>
              {c.label}
            </span>
          </div>
        </div>
      </div>

      {/* KANAN: Progress Setoran */}
      <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Progress Setoran</h2>
          <span className={`text-xl lg:text-2xl font-bold ${c.textColor}`}>
            {progress}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-4 lg:h-5 relative overflow-hidden">
            <div
              className={`h-4 lg:h-5 rounded-full transition-all duration-700 ${c.barColor}`}
              style={{ width: c.width }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-400">0%</span>
            <span className="text-xs text-gray-400">50%</span>
            <span className="text-xs text-gray-400">100%</span>
          </div>
          
          {state === 'EMPTY' && (
            <div className="mt-3 bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
              <p className="text-sm text-gray-500">📋 Mahasiswa belum melakukan setoran</p>
              <p className="text-xs text-gray-400 mt-1">Klik "Input Setoran" untuk memulai</p>
            </div>
          )}
        </div>

        {/* Cards Angka */}
        <div className="grid grid-cols-2 gap-2 lg:gap-4">
          <div className="bg-gray-50 p-3 lg:p-4 rounded-lg">
            <p className="text-xs lg:text-sm text-gray-500">Wajib Setor</p>
            <p className="text-xl lg:text-2xl font-bold text-gray-800">{wajibSetor}</p>
            <p className="text-xs text-gray-400 mt-0.5 lg:mt-1">Total surah</p>
          </div>
          <div className={`p-3 lg:p-4 rounded-lg ${sudahSetor === 0 ? 'bg-gray-50' : 'bg-emerald-50'}`}>
            <p className="text-xs lg:text-sm text-gray-500">Sudah Setor</p>
            <p className={`text-xl lg:text-2xl font-bold ${sudahSetor === 0 ? 'text-gray-400' : 'text-emerald-600'}`}>
              {sudahSetor}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 lg:mt-1">Surah tervalidasi</p>
          </div>
          <div className={`p-3 lg:p-4 rounded-lg ${belumSetor === 0 ? 'bg-emerald-50' : 'bg-orange-50'}`}>
            <p className="text-xs lg:text-sm text-gray-500">Belum Setor</p>
            <p className={`text-xl lg:text-2xl font-bold ${belumSetor === 0 ? 'text-emerald-600' : 'text-orange-600'}`}>
              {belumSetor}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 lg:mt-1">Surah tersisa</p>
          </div>
          <div className="bg-blue-50 p-3 lg:p-4 rounded-lg">
            <p className="text-xs lg:text-sm text-gray-500">Terakhir Setor</p>
            <p className="text-sm lg:text-lg font-bold text-blue-600">
              {info_dasar.terakhir_setor || 'Belum ada'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 lg:mt-1">
              {info_dasar.tgl_terakhir_setor
                ? new Date(info_dasar.tgl_terakhir_setor).toLocaleDateString('id-ID')
                : '-'}
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
}