import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, type = "info", opts = {}) => {
      const id = uid();
      const duration = typeof opts.duration === "number" ? opts.duration : 3000;

      setToasts((prev) => [...prev, { id, message, type }]);

      if (duration > 0) {
        window.setTimeout(() => remove(id), duration);
      }

      return id;
    },
    [remove]
  );

  const api = useMemo(
    () => ({
      toast: {
        info: (msg, opts) => push(msg, "info", opts),
        success: (msg, opts) => push(msg, "success", opts),
        error: (msg, opts) => push(msg, "error", opts),
      },
      remove,
      toasts,
    }),
    [push, remove, toasts]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastViewport toasts={toasts} onClose={remove} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast deve ser usado dentro de <ToastProvider />");
  }
  return ctx.toast;
}

function ToastViewport({ toasts, onClose }) {
  return (
    <div className="fixed z-[9999] right-4 top-4 space-y-2">
      {toasts.map((t) => {
        const styles =
          t.type === "success"
            ? "border-green-200 bg-green-50 text-green-900"
            : t.type === "error"
            ? "border-red-200 bg-red-50 text-red-900"
            : "border-gray-200 bg-white text-gray-900";

        return (
          <div
            key={t.id}
            className={`min-w-[280px] max-w-[360px] rounded-2xl border p-3 shadow-sm ${styles}`}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm">{t.message}</div>
              <button
                onClick={() => onClose(t.id)}
                className="text-xs px-2 py-1 rounded-lg border bg-white hover:bg-gray-50"
                type="button"
              >
                Fechar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
