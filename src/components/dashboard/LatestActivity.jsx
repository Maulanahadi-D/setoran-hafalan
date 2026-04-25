const LatestActivity = ({ data }) => {
  const mahasiswa = data?.info_mahasiswa_pa?.daftar_mahasiswa || [];
  const yangSudahSetor = mahasiswa.filter(m => m.info_setoran.total_sudah_setor > 0);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Aktivitas Terbaru</h2>
      {yangSudahSetor.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Belum ada aktivitas setoran</p>
      ) : (
        <div className="space-y-3">
          {yangSudahSetor.slice(0, 5).map((m, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{m.nama}</p>
                <p className="text-xs text-gray-500">
                  Progress: {m.info_setoran.persentase_progres_setor}% | 
                  Terakhir: {m.info_setoran.terakhir_setor}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LatestActivity;