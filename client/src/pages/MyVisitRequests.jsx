import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../components/Layout/Container";
import { listMyVisitRequests } from "../api/visitRequests";
import { getPostContact } from "../api/posts";
import { useToast } from "../components/Toast.jsx";

function statusBadge(status) {
  const base = "text-xs px-2 py-1 rounded-full font-medium";
  if (status === "APPROVED")
    return { label: "Aprovada", cls: `${base} bg-green-100 text-green-700` };
  if (status === "REJECTED")
    return { label: "Rejeitada", cls: `${base} bg-red-100 text-red-700` };
  return { label: "Pendente", cls: `${base} bg-yellow-100 text-yellow-800` };
}

export default function MyVisitRequests() {
  const toast = useToast();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [contactByPost, setContactByPost] = useState({});
  const [contactLoading, setContactLoading] = useState({});
  const [contactError, setContactError] = useState({});

  async function load({ silent = false } = {}) {
    setLoading(true);
    setErr("");
    try {
      const data = await listMyVisitRequests();
      setItems(Array.isArray(data) ? data : []);
      if (!silent) toast.success("Solicitações atualizadas.");
    } catch (e) {
      const m =
        e?.response?.data?.error || "Falha ao carregar suas solicitações.";
      setErr(m);
      if (!silent) toast.error(m);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load({ silent: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleGetContact(postId) {
    if (contactByPost[postId]) {
      toast.info("Contato já carregado.");
      return;
    }

    setContactLoading((p) => ({ ...p, [postId]: true }));
    setContactError((p) => ({ ...p, [postId]: "" }));

    try {
      const data = await getPostContact(postId);
      setContactByPost((p) => ({ ...p, [postId]: data }));
      toast.success("Contato liberado.");
    } catch (e) {
      const m =
        e?.response?.data?.error || "Não foi possível obter o contato.";
      setContactError((p) => ({ ...p, [postId]: m }));
      toast.error(m);
    } finally {
      setContactLoading((p) => ({ ...p, [postId]: false }));
    }
  }

  return (
    <Container>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Minhas solicitações</h1>
          <p className="text-sm text-gray-600 mt-1">
            Acompanhe o status das visitas que você solicitou.
          </p>
        </div>

        <button
          onClick={() => load()}
          className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-50 text-sm font-medium disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Atualizando..." : "Atualizar"}
        </button>
      </div>

      {loading ? (
        <div className="mt-6 p-4 rounded-2xl border bg-white text-sm text-gray-500">
          Carregando...
        </div>
      ) : err ? (
        <div className="mt-6 p-4 rounded-2xl border bg-white text-sm text-red-600">
          {String(err)}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-6 p-4 rounded-2xl border bg-white text-sm text-gray-600">
          Você ainda não solicitou nenhuma visita.
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((r) => {
            const b = statusBadge(r.status);
            const postId = r.post_id || r.postId;
            const postName = r.post_name || r.postName;
            const postType = r.post_type || r.postType;

            return (
              <div
                key={r.id}
                className="rounded-2xl border bg-white p-4 flex items-start justify-between gap-4 flex-wrap"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={b.cls}>{b.label}</span>

                    {postId ? (
                      <Link
                        to={`/posts/${postId}`}
                        className="font-semibold hover:underline"
                      >
                        {postName || "Ver anúncio"}
                      </Link>
                    ) : (
                      <span className="font-semibold">Solicitação</span>
                    )}

                    {postType ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                        {postType === "FOUND_LOST"
                          ? "Encontrado/Perdido"
                          : "Adoção"}
                      </span>
                    ) : null}
                  </div>

                  {r.message ? (
                    <div className="mt-2 text-sm text-gray-700 whitespace-pre-line">
                      <span className="text-gray-500">Mensagem:</span>{" "}
                      {r.message}
                    </div>
                  ) : (
                    <div className="mt-2 text-sm text-gray-500">
                      Sem mensagem.
                    </div>
                  )}

                  {r.created_at ? (
                    <div className="mt-2 text-xs text-gray-500">
                      Enviada em:{" "}
                      {new Date(r.created_at).toLocaleString("pt-BR")}
                    </div>
                  ) : null}

                  {r.status === "APPROVED" && postId ? (
                    <div className="mt-3">
                      {contactByPost[postId] ? (
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="text-sm">
                            WhatsApp:{" "}
                            <span className="font-semibold">
                              {contactByPost[postId].whatsapp}
                            </span>
                          </div>

                          <a
                            className="px-4 py-2 rounded-xl bg-black text-white text-sm font-medium"
                            href={`https://wa.me/${String(
                              contactByPost[postId].whatsapp
                            ).replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Abrir WhatsApp
                          </a>
                        </div>
                      ) : (
                        <div className="text-sm">
                          <button
                            onClick={() => handleGetContact(postId)}
                            disabled={!!contactLoading[postId]}
                            className="px-4 py-2 rounded-xl bg-black text-white text-sm font-medium disabled:opacity-60"
                          >
                            {contactLoading[postId]
                              ? "Carregando..."
                              : "Ver contato"}
                          </button>

                          {contactError[postId] ? (
                            <div className="mt-2 text-sm text-red-600">
                              {contactError[postId]}
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>

                <div className="flex items-center gap-2">
                  {postId ? (
                    <Link
                      to={`/posts/${postId}`}
                      className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-50 text-sm font-medium"
                    >
                      Abrir anúncio
                    </Link>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Container>
  );
}
