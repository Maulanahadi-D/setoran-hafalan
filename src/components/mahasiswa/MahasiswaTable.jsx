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
            const progress = m.info_setoran.persentase_progres_setor;
            const sudahSetor = m.info_setoran.total_sudah_setor;
            const wajibSetor = m.info_setoran.total_wajib_setor;
            
            // PERBAIKAN: Tentukan status berdasarkan data yang valid
            const getStatus = () => {
              // Jika total_sudah_setor = 0, pasti belum setor
              if (sudahSetor === 0) {
                return {
                  label: 'Belum Setor',
                  className: 'bg-gray-100 text-gray-600'
                };
              }
              
              // Jika progress = 100 atau sudah_setor = wajib_setor, lunas
              if (progress >= 100 || sudahSetor >= wajibSetor) {
                return {
                  label: 'Lunas ✓',
                  className: 'bg-emerald-100 text-emerald-800'
                };
              }
              
              // Jika progress > 0 tapi < 100, dalam progress
              if (progress > 0 && progress < 100) {
                return {
                  label: `${sudahSetor}/${wajibSetor} Surah`,
                  className: 'bg-yellow-100 text-yellow-800'
                };
              }
              
              // Fallback: jika data tidak valid
              return {
                label: 'Belum Setor',
                className: 'bg-gray-100 text-gray-600'
              };
            };

            const status = getStatus();
            
            // PERBAIKAN: Hitung ulang progress untuk memastikan akurasi
            const calculatedProgress = wajibSetor > 0 
              ? Math.round((sudahSetor / wajibSetor) * 100) 
              : 0;
            
            // Gunakan progress dari API, tapi validasi
            const displayProgress = sudahSetor === 0 ? 0 : progress;
            
            return (
              <tr key={m.nim} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-800">{m.nim}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-800">{m.nama}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{m.angkatan}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    {/* Progress Bar */}
                    <div className="flex-1 max-w-[120px]">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-500 ${
                            displayProgress === 0 
                              ? 'bg-gray-300' 
                              : displayProgress < 30 
                                ? 'bg-orange-500' 
                                : displayProgress < 70 
                                  ? 'bg-yellow-500' 
                                  : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.max(displayProgress, sudahSetor > 0 ? 3 : 0)}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Percentage */}
                    <span className={`text-sm font-medium min-w-[45px] ${
                      displayProgress === 0 
                        ? 'text-gray-400' 
                        : displayProgress < 30 
                          ? 'text-orange-600' 
                          : displayProgress < 70 
                            ? 'text-yellow-600' 
                            : 'text-emerald-600'
                    }`}>
                      {displayProgress}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}>
                    {status.label}
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