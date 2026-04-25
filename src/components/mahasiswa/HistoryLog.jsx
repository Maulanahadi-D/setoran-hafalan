export default function HistoryLog({ log }) {
  if (!log || log.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Riwayat Log</h2>
        <p className="text-center py-8 text-gray-500">Belum ada riwayat aktivitas</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Riwayat Log</h2>
      <div className="space-y-3">
        {log.map((item) => (
          <div key={item.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className={`w-2 h-2 mt-2 rounded-full ${
              item.aksi === 'VALIDASI' ? 'bg-emerald-500' : 'bg-red-500'
            }`} />
            <div className="flex-1">
              <div className="flex justify-between">
                <p className="text-sm font-medium">
                  {item.aksi === 'VALIDASI' ? '✅' : '❌'} {item.keterangan}
                </p>
                <span className="text-xs text-gray-500">
                  {new Date(item.timestamp).toLocaleString('id-ID')}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Oleh: {item.dosen_yang_mengesahkan.nama}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}