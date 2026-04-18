import { createContext, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const showToast = (message, type = "success", duration = 3000) => {
    const id = Date.now() + Math.random();

    const toast = { id, message, type };
    setToasts((prev) => [...prev, toast]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const value = useMemo(() => ({ showToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
}

function ToastViewport({ toasts, onClose }) {
  return (
    <>
      <style>{`
        .toast-viewport {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 99999;
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: min(360px, calc(100vw - 32px));
        }

        .toast-item {
          border-radius: 16px;
          padding: 14px 16px;
          box-shadow: 0 14px 34px rgba(17,24,39,0.14);
          border: 1px solid rgba(255,255,255,0.35);
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          animation: toastSlide .22s ease;
          backdrop-filter: blur(10px);
          font-family: Inter, sans-serif;
        }

        .toast-item.success {
          background: rgba(236, 253, 245, 0.96);
          color: #065f46;
        }

        .toast-item.error {
          background: rgba(254, 242, 242, 0.97);
          color: #991b1b;
        }

        .toast-item.info {
          background: rgba(239, 246, 255, 0.97);
          color: #1d4ed8;
        }

        .toast-left {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          min-width: 0;
          flex: 1;
        }

        .toast-icon {
          font-size: 1rem;
          line-height: 1.2;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .toast-message {
          font-size: 0.9rem;
          font-weight: 700;
          line-height: 1.45;
          word-break: break-word;
        }

        .toast-close {
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 1rem;
          color: inherit;
          opacity: 0.72;
          flex-shrink: 0;
        }

        .toast-close:hover {
          opacity: 1;
        }

        @keyframes toastSlide {
          from {
            opacity: 0;
            transform: translateY(-8px) translateX(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateX(0);
          }
        }
      `}</style>

      <div className="toast-viewport">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-item ${toast.type}`}>
            <div className="toast-left">
              <div className="toast-icon">
                {toast.type === "success" ? "✅" : toast.type === "error" ? "❌" : "ℹ️"}
              </div>
              <div className="toast-message">{toast.message}</div>
            </div>

            <button className="toast-close" onClick={() => onClose(toast.id)}>
              ×
            </button>
          </div>
        ))}
      </div>
    </>
  );
}