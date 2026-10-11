import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="toast-container" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              {toast.type === 'success' && <CheckCircle2 size={18} style={{ color: 'var(--accent-emerald)' }} />}
              {toast.type === 'error' && <AlertCircle size={18} style={{ color: 'var(--accent-rose)' }} />}
              {toast.type === 'warning' && <AlertTriangle size={18} style={{ color: 'var(--accent-amber)' }} />}
              {toast.type === 'info' && <Info size={18} style={{ color: 'var(--accent-blue)' }} />}
            </span>
            <span style={{ flex: 1, fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>
              {toast.message}
            </span>
            <button
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss notification"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '0.2rem',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
