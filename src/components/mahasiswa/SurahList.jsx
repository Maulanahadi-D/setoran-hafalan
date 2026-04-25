import { CheckCircle, XCircle } from 'lucide-react';

const LABELS = {
  KP: 'Kerja Praktek',
  SEMKP: 'Seminar KP',
  DAFTAR_TA: 'Daftar TA',
  SEMPRO: 'Seminar Proposal',
  SIDANG_TA: 'Sidang TA'
};

export default function SurahList({ detail, onDelete }) {
  const grouped = detail.reduce((acc, surah) => {
    if (!acc[surah.label]) acc[surah.label] = [];
    acc[surah.label].push(surah);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([label, surahs]) => (
        <div key={label} className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {LABELS[label] || label}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {surahs.map(surah => (
              <div
                key={surah.id}
                className={`p-3 rounded-lg border ${
                  surah.sudah_setor
                    ? 'border-emerald-200 bg-emerald-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{surah.nama}</p>
                    <p className="text-xs text-gray-500 mt-1">{surah.nama_arab}</p>
                    <p className="text-xs text-gray-400 mt-1">Surah ke-{surah.external_id}</p>
                    {surah.sudah_setor && surah.info_setoran && (
                      <div className="mt-2 text-xs text-gray-500">
                        <p>Setor: {surah.info_setoran.tgl_setoran}</p>
                        <p>Validasi: {surah.info_setoran.tgl_validasi}</p>
                        <p className="text-gray-400">Oleh: {surah.info_setoran.dosen_yang_mengesahkan.nama}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {surah.sudah_setor ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-300" />
                    )}
                    {surah.sudah_setor && (
                      <button
                        onClick={() => onDelete(surah)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}