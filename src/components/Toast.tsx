import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
            case 'error':
              return <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
            case 'warning':
              return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
            default:
              return <Info className="w-5 h-5 text-purple-400 shrink-0" />;
          }
        };

        const getBorderColor = () => {
          switch (toast.type) {
            case 'success':
              return 'border-emerald-500/30';
            case 'error':
              return 'border-rose-500/30';
            case 'warning':
              return 'border-amber-500/30';
            default:
              return 'border-purple-500/30';
          }
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl glass-panel shadow-2xl ${getBorderColor()} transition-all duration-200 transform translate-y-0`}
          >
            {getIcon()}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white tracking-wide">{toast.title}</h4>
              {toast.message && (
                <p className="text-xs text-neutral-300 mt-0.5 leading-relaxed">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-white transition-colors p-1"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
