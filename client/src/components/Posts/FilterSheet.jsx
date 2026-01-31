import { useEffect } from "react";

export default function FilterSheet({ open, onClose, title = "Filtros", children }) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Fechar filtros"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Painel: Mobile = bottom sheet | Desktop = modal central */}
      <div
        role="dialog"
        aria-modal="true"
        className="
          absolute left-0 right-0 bottom-0
          bg-white rounded-t-2xl border-t
          max-h-[85vh] overflow-auto
          shadow-2xl
          animate-[slideUp_180ms_ease-out]
          md:animate-none
          md:left-1/2 md:top-1/2 md:bottom-auto md:right-auto
          md:w-[720px] md:max-w-[92vw]
          md:-translate-x-1/2 md:-translate-y-1/2
          md:rounded-2xl md:border
        "
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur border-b rounded-t-2xl md:rounded-t-2xl">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Handle (mobile) */}
              <div className="md:hidden w-10 h-1.5 rounded-full bg-gray-300" />
              <h2 className="text-base font-semibold text-gray-900">{title}</h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="h-9 w-9 rounded-xl border bg-white hover:bg-gray-50 grid place-items-center"
              aria-label="Fechar"
              title="Fechar"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
