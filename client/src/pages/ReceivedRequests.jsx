import { useEffect, useState } from "react";
import Container from "../components/Layout/Container";
import { listReceivedRequests, updateVisitRequest } from "../api/visitRequests";
import { Link } from "react-router-dom";

function statusLabel(status) {
  if (status === "PENDING") return "Pendente";
  if (status === "APPROVED") return "Aprovada — contato liberado";
  if (status === "REJECTED") return "Rejeitada";
  return status;
}

function StatusBadge({ status }) {
  const cls =
    status === "PENDING"
      ? "bg-yellow-100 text-yellow-800"
      : status === "APPROVED"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${cls}`}>
      {statusLabel(status)}
    </span>
  );
}

export default function ReceivedRequests() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const data = await listReceivedRequests();
      setItems(data);
    } catch (e) {
      setErr(e?.response?.data?.error || "Erro ao carregar solicitações");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(id, status) {
    setActionLoadingId(id);
    try {
      await updateVisitRequest(id, status);
      setItems((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    } catch (e) {
      alert(e?.response?.data?.error || "Erro ao atualizar solicitação");
    } finally {
      setActionLoadingId(null);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <Container>
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Solicitações recebidas</h1>
          <p className="text-sm text-gray-600">
            Aprove ou rejeite pedidos de visita.
          </p>
        </div>

        <button
          onClick={load}
          className="px-3 py-2 rounded-lg text-sm border bg-white hover:bg-gray-50"
        >
          Atualizar
        </button>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="p-4 rounded-2xl border bg-white text-sm text-gray-500">
            Carregando...
          </div>
        ) : err ? (
          <div className="p-4 rounded-2xl border bg-white text-sm text-red-600">
            {String(err)}
          </div>
        ) : items.length === 0 ? (
          <div className="p-4 rounded-2xl border bg-white text-sm text-gray-500">
            Nenhuma solicitação recebida até o momento.
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl border bg-white p-4 flex items-start justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      to={`/posts/${r.post_id}`}
                      className="font-semibold hover:underline"
                    >
                      {r.post_name || "Post"}
                    </Link>
                    <StatusBadge status={r.status} />
                  </div>

                  <div className="mt-1 text-sm text-gray-600">
                    Solicitante:{" "}
                    <span className="font-medium text-gray-800">
                      {r.requester_name || r.requesterName || "—"}
                    </span>
                  </div>

                  <div className="mt-2 text-sm text-gray-800 whitespace-pre-line">
                    {r.message}
                  </div>

                  <div className="mt-2 text-xs text-gray-500">
                    {r.created_at
                      ? new Date(r.created_at).toLocaleString("pt-BR")
                      : r.createdAt
                      ? new Date(r.createdAt).toLocaleString("pt-BR")
                      : null}
                  </div>
                </div>

                {r.status === "PENDING" ? (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleUpdate(r.id, "REJECTED")}
                      disabled={actionLoadingId === r.id}
                      className="px-3 py-2 rounded-lg text-sm border bg-white hover:bg-gray-50 disabled:opacity-60"
                    >
                      Rejeitar
                    </button>
                    <button
                      onClick={() => handleUpdate(r.id, "APPROVED")}
                      disabled={actionLoadingId === r.id}
                      className="px-3 py-2 rounded-lg text-sm bg-black text-white disabled:opacity-60"
                    >
                      Aprovar
                    </button>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 flex-shrink-0">
                    {statusLabel(r.status)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
