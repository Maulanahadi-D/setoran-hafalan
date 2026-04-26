export default function SummaryCard({ title, value, subtitle, icon: Icon, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600'
  };

  const displayValue = (value === undefined || value === null || isNaN(value)) ? 0 : value;

  return (
    <div className="bg-white rounded-xl shadow-sm p-3 lg:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs lg:text-sm font-medium text-gray-500">{title}</p>
          <p className="text-xl lg:text-3xl font-bold text-gray-800 mt-1 lg:mt-2">
            {displayValue}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-0.5 lg:mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-2 lg:p-3 rounded-lg ${colors[color]}`}>
          <Icon className="w-4 h-4 lg:w-6 lg:h-6" />
        </div>
      </div>
    </div>
  );
}