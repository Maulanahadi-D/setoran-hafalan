import { useState } from 'react';

export default function MahasiswaTable({ data, onDetail }) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
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
              const sudahSetor = m?.info_setoran?.total_sudah_setor || 0;
              const wajibSetor = m?.info_setoran?.total_wajib_setor || 0;
              const progress = m?.info_setoran?.persentase_progres_setor || 0;

              const getState = () => {
                if (sudahSetor === 0) return 'EMPTY';
                if (sudahSetor >= wajibSetor) return 'FULL';
                return 'PARTIAL';
              };
              const state = getState();

              const config = {
                EMPTY: {
                  color: 'bg-gray-300', textColor: 'text-gray-400',
                  width: '0%', percentage: '0%',
                  statusLabel: 'Belum Setor', statusClass: 'bg-gray-100 text-gray-600',
                },
                PARTIAL: {
                  color: progress < 30 ? 'bg-orange-500' : progress < 70 ? 'bg-yellow-500' : 'bg-emerald-500',
                  textColor: progress < 30 ? 'text-orange-600' : progress < 70 ? 'text-yellow-600' : 'text-emerald-600',
                  width: `${Math.max(progress, 3)}%`, percentage: `${progress}%`,
                  statusLabel: `${sudahSetor}/${wajibSetor} Surah`, statusClass: 'bg-yellow-100 text-yellow-800',
                },
                FULL: {
                  color: 'bg-emerald-500', textColor: 'text-emerald-600',
                  width: '100%', percentage: '100%',
                  statusLabel: 'Lunas ✓', statusClass: 'bg-emerald-100 text-emerald-800',
                },
              };
              const c = config[state];

              return (
                <tr key={m.nim} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-800">{m.nim}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{m.nama}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{m.angkatan}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 max-w-[120px]">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className={`h-2.5 rounded-full ${c.color}`} style={{ width: c.width }} />
                        </div>
                      </div>
                      <span className={`text-sm font-medium min-w-[45px] ${c.textColor}`}>{c.percentage}</span>
                    </div>
                  </td>
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

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {data.map((m) => {
          const sudahSetor = m?.info_setoran?.total_sudah_setor || 0;
          const wajibSetor = m?.info_setoran?.total_wajib_setor || 0;
          const progress = m?.info_setoran?.persentase_progres_setor || 0;

          const getState = () => {
            if (sudahSetor === 0) return 'EMPTY';
            if (sudahSetor >= wajibSetor) return 'FULL';
            return 'PARTIAL';
          };
          const state = getState();

          const config = {
            EMPTY: {
              color: 'bg-gray-300', textColor: 'text-gray-400',
              width: '0%', percentage: '0%',
              statusLabel: 'Belum Setor', statusClass: 'bg-gray-100 text-gray-600',
            },
            PARTIAL: {
              color: progress < 30 ? 'bg-orange-500' : progress < 70 ? 'bg-yellow-500' : 'bg-emerald-500',
              textColor: progress < 30 ? 'text-orange-600' : progress < 70 ? 'text-yellow-600' : 'text-emerald-600',
              width: `${Math.max(progress, 3)}%`, percentage: `${progress}%`,
              statusLabel: `${sudahSetor}/${wajibSetor} Surah`, statusClass: 'bg-yellow-100 text-yellow-800',
            },
            FULL: {
              color: 'bg-emerald-500', textColor: 'text-emerald-600',
              width: '100%', percentage: '100%',
              statusLabel: 'Lunas ✓', statusClass: 'bg-emerald-100 text-emerald-800',
            },
          };
          const c = config[state];

          return (
            <div key={m.nim} className="bg-white rounded-xl shadow-sm p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800">{m.nama}</p>
                  <p className="text-sm text-gray-500">{m.nim}</p>
                  <p className="text-xs text-gray-400">Angkatan {m.angkatan}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${c.statusClass}`}>
                  {c.statusLabel}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full ${c.color}`} style={{ width: c.width }} />
                  </div>
                </div>
                <span className={`text-sm font-medium ${c.textColor}`}>{c.percentage}</span>
              </div>

              <button
                onClick={() => onDetail(m.nim)}
                className="w-full py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
              >
                Lihat Detail
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}