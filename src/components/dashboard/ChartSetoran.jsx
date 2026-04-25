const ChartSetoran = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Setoran 7 Hari Terakhir</h2>
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">Grafik akan ditampilkan di sini</p>
      </div>
    </div>
  );
};

export default ChartSetoran;