import { useState } from "react";

export default function RequestVisitModal({ open, onClose, onSubmit, loading }) {
  const [message, setMessage] = useState("Olá! Posso combinar uma visita?");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 grid place-items-center px-4 z-50">
      <div className="w-full max-w-lg rounded-2xl bg-white border p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-semibold">Solicitar visita</div>
            <div className="text-sm text-gray-600">
              Envie uma mensagem para o anunciante avaliar seu pedido.
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg hover:bg-gray-100 text-sm"
          >
            ✕
          </button>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium">Mensagem</label>
          <textarea
            className="mt-1 w-full border rounded-xl px-3 py-2 min-h-[120px]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
          />
          <div className="text-xs text-gray-500 mt-1">{message.length}/500</div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-50 text-sm font-medium"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={() => onSubmit(message)}
            className="px-4 py-2 rounded-xl bg-black text-white text-sm font-medium"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar pedido"}
          </button>
        </div>
      </div>
    </div>
  );
}
