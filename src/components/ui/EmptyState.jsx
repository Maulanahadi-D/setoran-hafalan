import { Inbox } from 'lucide-react';

export default function EmptyState({ message = 'Tidak ada data' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Inbox className="w-16 h-16 text-gray-300 mb-4" />
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  );
}