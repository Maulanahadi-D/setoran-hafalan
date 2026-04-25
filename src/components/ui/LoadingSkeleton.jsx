export default function LoadingSkeleton() {
  return (
    <div className="p-6 animate-pulse space-y-6">
      <div className="h-8 bg-gray-200 rounded w-1/4" />
      <div className="grid grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-xl p-6">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="h-8 bg-gray-200 rounded w-1/3" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl p-6">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}