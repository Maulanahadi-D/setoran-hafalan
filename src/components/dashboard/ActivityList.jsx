import { Clock, TrendingUp } from 'lucide-react';

export default function ActivityList({ data }) {
  // ✅ PERBAIKAN: Safe access dengan default
  const mahasiswa = data?.info_mahasiswa_pa?.daftar_mahasiswa || [];
  
  const sorted = [...mahasiswa].sort((a, b) => {
    const aDate = a?.info_setoran?.tgl_terakhir_setor || '0000-00-00';
    const bDate = b?.info_setoran?.tgl_terakhir_setor || '0000-00-00';
    return bDate.localeCompare(aDate);
  });

  const active = sorted.filter(m => m?.info_setoran?.total_sudah_setor > 0);
  const inactive = sorted.filter(m => !m?.info_setoran?.total_sudah_setor || m.info_setoran.total_sudah_setor === 0);

  if (mahasiswa.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Aktivitas Mahasiswa</h2>
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Belum ada mahasiswa</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Aktivitas Mahasiswa</h2>
      
      <div className="space-y-4">
        {/* Yang Sudah Setor */}
        {active.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-emerald-600 mb-2">
              Sudah Setor ({active.length})
            </h3>
            <div className="space-y-2">
              {active.slice(0, 5).map((m, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{m.nama}</p>
                    <p className="text-xs text-gray-500">
                      {m.nim} • {m.info_setoran?.total_sudah_setor || 0}/{m.info_setoran?.total_wajib_setor || 0} surah
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-emerald-600">
                      {m.info_setoran?.persentase_progres_setor || 0}%
                    </p>
                    <p className="text-xs text-gray-400">{m.info_setoran?.terakhir_setor || '-'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Yang Belum Setor */}
        {inactive.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Belum Setor ({inactive.length})
            </h3>
            <div className="space-y-2">
              {inactive.slice(0, 3).map((m, i) => (
                <div key={i} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-4 h-4 text-gray-400 mr-3" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{m.nama}</p>
                    <p className="text-xs text-gray-400">{m.nim}</p>
                  </div>
                  <span className="text-xs text-gray-400">0%</span>
                </div>
              ))}
              {inactive.length > 3 && (
                <p className="text-xs text-gray-400 text-center">
                  +{inactive.length - 3} mahasiswa lainnya
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}