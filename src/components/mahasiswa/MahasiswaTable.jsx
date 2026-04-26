export default function MahasiswaTable({ data, onDetail }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">NIM</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Angkatan</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((m) => {
            // ✅ STEP 1: Extract data with safe defaults
            const sudahSetor = m?.info_setoran?.total_sudah_setor || 0;
            const wajibSetor = m?.info_setoran?.total_wajib_setor || 0;
            const progress = m?.info_setoran?.persentase_progres_setor || 0;

            // ✅ STEP 2: Determine state ONCE (single source of truth)
            const getState = () => {
              if (sudahSetor === 0) return 'EMPTY';        // 0 surah setor
              if (sudahSetor >= wajibSetor) return 'FULL';  // All surah setor
              return 'PARTIAL';                              // Some surah setor
            };

            const state = getState();

            // ✅ STEP 3: Config based on state (no conflicting conditions)
            const config = {
              EMPTY: {
                color: 'bg-gray-300',
                textColor: 'text-gray-400',
                width: '0%',
                percentage: '0%',
                statusLabel: 'Belum Setor',
                statusClass: 'bg-gray-100 text-gray-600',
              },
              PARTIAL: {
                color: progress < 30 ? 'bg-orange-500' : progress < 70 ? 'bg-yellow-500' : 'bg-emerald-500',
                textColor: progress < 30 ? 'text-orange-600' : progress < 70 ? 'text-yellow-600' : 'text-emerald-600',
                width: `${Math.max(progress, 3)}%`,
                percentage: `${progress}%`,
                statusLabel: `${sudahSetor}/${wajibSetor} Surah`,
                statusClass: 'bg-yellow-100 text-yellow-800',
              },
              FULL: {
                color: 'bg-emerald-500',
                textColor: 'text-emerald-600',
                width: '100%',
                percentage: '100%',
                statusLabel: 'Lunas ✓',
                statusClass: 'bg-emerald-100 text-emerald-800',
              },
            };

            const c = config[state];

            return (
              <tr key={m.nim} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-800">{m.nim}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800">{m.nama}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{m.angkatan}</td>
                
                {/* Progress Bar */}
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 max-w-[120px]">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-500 ${c.color}`}
                          style={{ width: c.width }}
                        />
                      </div>
                    </div>
                    <span className={`text-sm font-medium min-w-[45px] ${c.textColor}`}>
                      {c.percentage}
                    </span>
                  </div>
                </td>
                
                {/* Status Badge */}
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.statusClass}`}>
                    {c.statusLabel}
                  </span>
                </td>
                
                <td className="px-6 py-4">
                  <button
                    onClick={() => onDetail(m.nim)}
                    className="text-emerald-600 hover:text-emerald-700 font-medium text-sm hover:underline"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}