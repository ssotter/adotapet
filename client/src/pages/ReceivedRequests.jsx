import { useEffect, useMemo, useState } from "react";
import Container from "../components/Layout/Container";
import { listReceivedRequests, updateVisitRequest } from "../api/visitRequests";
import { Link } from "react-router-dom";
import { useToast } from "../components/Toast.jsx";

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

function RequestsSkeleton({ count = 4 }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl border bg-white p-4 flex items-start justify-between gap-4"
          aria-hidden="true"
        >
          <div className="min-w-0 w-full">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="h-4 bg-gray-100 rounded w-40" />
              <div className="h-6 bg-gray-100 rounded-full w-32" />
            </div>

            <div className="mt-2 h-3 bg-gray-100 rounded w-56" />

            <div className="mt-4 space-y-2">
              <div className="h-3 bg-gray-100 rounded w-full" />
              <div className="h-3 bg-gray-100 rounded w-11/12" />
              <div className="h-3 bg-gray-100 rounded w-10/12" />
            </div>

            <div className="mt-3 h-3 bg-gray-100 rounded w-40" />
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <div className="h-10 w-24 bg-gray-100 rounded-lg" />
            <div className="h-10 w-24 bg-gray-100 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

function getCreatedTime(r) {
  const raw = r?.created_at ?? r?.createdAt ?? null;
  const t = raw ? new Date(raw).getTime() : 0;
  return Number.isFinite(t) ? t : 0;
}

function statusRank(status) {
  if (status === "PENDING") return 0;
  if (status === "APPROVED") return 1;
  if (status === "REJECTED") return 2;
  return 99;
}

export default function ReceivedRequests() {
  const toast = useToast();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  async function load({ silent = false } = {}) {
    setLoading(true);
    setErr(null);
    try {
      const data = await listReceivedRequests();
      setItems(Array.isArray(data) ? data : []);
      if (!silent) toast.success("Solicitações atualizadas.");
    } catch (e) {
      const m = e?.response?.data?.error || "Erro ao carregar solicitações";
      setErr(m);
      if (!silent) toast.error(m);
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

      toast.success(
        status === "APPROVED"
          ? "Solicitação aprovada. Contato liberado."
          : "Solicitação rejeitada."
      );
    } catch (e) {
      toast.error(e?.response?.data?.error || "Erro ao atualizar solicitação");
    } finally {
      setActionLoadingId(null);
    }
  }

  useEffect(() => {
    load({ silent: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sortedItems = useMemo(() => {
    const list = Array.isArray(items) ? [...items] : [];
    return list.sort((a, b) => {
      const sr = statusRank(a.status) - statusRank(b.status);
      if (sr !== 0) return sr;
      return getCreatedTime(b) - getCreatedTime(a);
    });
  }, [items]);

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
          onClick={() => load()}
          className="px-3 py-2 rounded-lg text-sm border bg-white hover:bg-gray-50 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Atualizando..." : "Atualizar"}
        </button>
      </div>

      <div className="mt-6">
        {loading ? (
          <RequestsSkeleton count={4} />
        ) : err ? (
          <div className="p-4 rounded-2xl border bg-white text-sm text-red-600">
            {String(err)}
          </div>
        ) : sortedItems.length === 0 ? (
          <div className="p-6 rounded-2xl border bg-white">
            <div className="text-sm text-gray-700 font-medium">
              Nenhuma solicitação recebida até o momento.
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Quando alguém solicitar uma visita em um dos seus anúncios, ela vai
              aparecer aqui.
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedItems.map((r) => (
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
                      {actionLoadingId === r.id ? "..." : "Rejeitar"}
                    </button>
                    <button
                      onClick={() => handleUpdate(r.id, "APPROVED")}
                      disabled={actionLoadingId === r.id}
                      className="px-3 py-2 rounded-lg text-sm bg-black text-white disabled:opacity-60"
                    >
                      {actionLoadingId === r.id ? "..." : "Aprovar"}
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
