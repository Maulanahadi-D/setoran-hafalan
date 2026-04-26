import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function Modal({ children, onClose, title }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 lg:p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white lg:rounded-xl shadow-2xl w-full lg:max-w-2xl h-full lg:max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 lg:p-6 border-b flex-shrink-0">
          <h2 className="text-lg lg:text-xl font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 lg:p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}