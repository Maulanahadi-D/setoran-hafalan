import { useState } from 'react';
import { useToast } from '../../context/ToastContext';

const LABELS = {
  KP: 'Kerja Praktek',
  SEMKP: 'Seminar KP',
  DAFTAR_TA: 'Daftar TA',
  SEMPRO: 'Seminar Proposal',
  SIDANG_TA: 'Sidang TA'
};

export default function SetoranForm({ detail, onSubmit, onCancel }) {
  const [selected, setSelected] = useState([]);
  const [tglSetoran, setTglSetoran] = useState('');
  const { addToast } = useToast();

  const toggleSurah = (surah) => {
    setSelected(prev => {
      const exists = prev.find(s => s.id_komponen_setoran === surah.id);
      if (exists) {
        return prev.filter(s => s.id_komponen_setoran !== surah.id);
      }
      return [...prev, {
        nama_komponen_setoran: surah.nama,
        id_komponen_setoran: surah.id
      }];
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selected.length === 0) {
      addToast('Pilih minimal satu surah', 'error');
      return;
    }
    
    const payload = { data_setoran: selected };
    if (tglSetoran) {
      payload.tgl_setoran = tglSetoran;
    }
    
    onSubmit(payload);
  };

  const grouped = detail.reduce((acc, surah) => {
    if (!acc[surah.label]) acc[surah.label] = [];
    acc[surah.label].push(surah);
    return acc;
  }, {});

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tanggal Setoran (Opsional)
        </label>
        <input
          type="date"
          value={tglSetoran}
          onChange={(e) => setTglSetoran(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {Object.entries(grouped).map(([label, surahs]) => (
          <div key={label}>
            <h3 className="font-medium text-gray-700 mb-2">{LABELS[label] || label}</h3>
            <div className="grid grid-cols-2 gap-2">
              {surahs.map(surah => (
                <label
                  key={surah.id}
                  className={`flex items-center p-2 rounded-lg border cursor-pointer transition-colors ${
                    selected.find(s => s.id_komponen_setoran === surah.id)
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  } ${surah.sudah_setor ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={!!selected.find(s => s.id_komponen_setoran === surah.id)}
                    onChange={() => toggleSurah(surah)}
                    disabled={surah.sudah_setor}
                    className="mr-2"
                  />
                  <div>
                    <p className="text-sm font-medium">{surah.nama}</p>
                    <p className="text-xs text-gray-500">{surah.external_id}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          Simpan Setoran
        </button>
      </div>
    </form>
  );
}