import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info
};

const styles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800'
};

export default function Toast({ message, type = 'info', onClose }) {
  const Icon = icons[type];

  return (
    <div className={`flex items-center p-4 rounded-lg border shadow-lg ${styles[type]} animate-slide-in`}>
      <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
      <p className="text-sm flex-1">{message}</p>
      <button onClick={onClose} className="ml-3 flex-shrink-0 hover:opacity-70">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}