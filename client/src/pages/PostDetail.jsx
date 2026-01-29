import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Container from "../components/Layout/Container";
import PhotoCarousel from "../components/Posts/PhotoCarousel";
import RequestVisitModal from "../components/Posts/RequestVisitModal";
import {
  getPostById,
  getPostContact,
  requestVisit,
  setPostStatus,
  favoritePost,      // ✅ ADICIONADO
  unfavoritePost,    // ✅ ADICIONADO
} from "../api/posts";
import { useAuth } from "../store/auth";
import { useToast } from "../components/Toast.jsx";

function typeLabel(type) {
  return type === "FOUND_LOST" ? "Encontrado/Perdido" : "Adoção";
}

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [contact, setContact] = useState(null);
  const [contactError, setContactError] = useState(null);

  const isOwner = !!(user && post?.owner_id && user.id === post.owner_id);

  // ✅ FAVORITO (estado local igual ao PostCard)
  const initialFav = useMemo(
    () => Boolean(post?.is_favorited),
    [post?.is_favorited],
  );
  const [isFav, setIsFav] = useState(initialFav);
  const [savingFav, setSavingFav] = useState(false);

  useEffect(() => {
    setIsFav(Boolean(post?.is_favorited));
  }, [post?.is_favorited]);

  async function toggleFavorite() {
    // igual comportamento do PostCard: só funciona logado
    if (!user || savingFav || !post?.id) return;

    const next = !isFav;
    setIsFav(next); // otimista
    // mantém o post coerente também (opcional, mas ajuda)
    setPost((prev) => (prev ? { ...prev, is_favorited: next } : prev));
    setSavingFav(true);

    try {
      if (next) {
        await favoritePost(post.id);
      } else {
        await unfavoritePost(post.id);
      }
    } catch {
      // rollback se falhar
      setIsFav(!next);
      setPost((prev) => (prev ? { ...prev, is_favorited: !next } : prev));
    } finally {
      setSavingFav(false);
    }
  }

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const data = await getPostById(id);
      setPost(data);
    } catch (e) {
      setErr(e?.response?.data?.error || "Falha ao carregar anúncio");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function handleOpenRequestVisit() {
    if (!user) {
      toast.info("Para solicitar uma visita, primeiro faça login.");
      navigate("/login");
      return;
    }
    setOpenModal(true);
  }

  async function handleRequestVisit(message) {
    if (!user) {
      toast.info("Faça login para solicitar visita.");
      navigate("/login");
      return;
    }

    setActionLoading(true);
    try {
      await requestVisit(id, message);
      setOpenModal(false);
      toast.success("Pedido enviado! Aguarde aprovação do anunciante.");
    } catch (e) {
      toast.error(e?.response?.data?.error || "Falha ao solicitar visita");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleGetContact() {
    if (!user) {
      toast.info("Faça login para ver o contato do anunciante.");
      navigate("/login");
      return;
    }

    setContactError(null);
    setActionLoading(true);
    try {
      const data = await getPostContact(id);
      setContact(data);
      toast.success("Contato liberado.");
    } catch (e) {
      const msg = e?.response?.data?.error || "Não foi possível obter o contato";
      setContact(null);
      setContactError(msg);
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleResolvePost() {
    const confirmed = window.confirm(
      "Tem certeza que deseja encerrar este anúncio?",
    );
    if (!confirmed) return;

    setActionLoading(true);
    try {
      await setPostStatus(post.id, "RESOLVED");
      toast.success("Anúncio encerrado com sucesso.");
      load();
    } catch (e) {
      toast.error(e?.response?.data?.error || "Erro ao encerrar anúncio");
    } finally {
      setActionLoading(false);
    }
  }

  // ✅ fotos ordenadas com capa em primeiro
  const orderedPhotos = useMemo(() => {
    const list = Array.isArray(post?.photos) ? [...post.photos] : [];
    const coverId = post?.cover_photo_id || null;
    if (!coverId || list.length === 0) return list;

    const idx = list.findIndex((p) => p.id === coverId);
    if (idx <= 0) return list;

    const [cover] = list.splice(idx, 1);
    return [cover, ...list];
  }, [post?.photos, post?.cover_photo_id]);

  if (loading) {
    return (
      <Container>
        <div className="p-4 rounded-2xl border bg-white text-sm text-gray-500">
          Carregando anúncio...
        </div>
      </Container>
    );
  }

  if (err) {
    return (
      <Container>
        <div className="p-4 rounded-2xl border bg-white text-sm text-red-600">
          {String(err)}
        </div>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container>
        <div className="p-4 rounded-2xl border bg-white text-sm text-gray-500">
          Anúncio não encontrado.
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          {/* ✅ ❤️ no topo (igual ao PostCard: só aparece logado) */}
          {user ? (
            <button
              type="button"
              onClick={toggleFavorite}
              disabled={savingFav}
              aria-label={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              className={`mt-1 h-10 w-10 rounded-full grid place-items-center
                backdrop-blur border transition
                ${isFav ? "bg-red-50 border-red-200" : "bg-white/80 border-gray-200"}
                ${savingFav ? "opacity-60" : "opacity-100 hover:scale-[1.02]"}
              `}
              title={isFav ? "Favoritado" : "Favoritar"}
            >
              <span className={`${isFav ? "text-red-600" : "text-gray-600"} text-lg leading-none`}>
                {isFav ? "❤️" : "🤍"}
              </span>
            </button>
          ) : null}

          <div>
            <h1 className="text-2xl font-semibold">{post.name || "Sem nome"}</h1>
            <div className="text-sm text-gray-600">
              {post.neighborhood} • {typeLabel(post.type)}
            </div>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {!isOwner && (
            <button
              onClick={handleOpenRequestVisit}
              title={!user ? "Para solicitar uma visita, faça login." : ""}
              className="px-4 py-2 rounded-xl bg-black text-white text-sm font-medium"
            >
              Solicitar visita
            </button>
          )}

          {!isOwner && (
            <button
              onClick={handleGetContact}
              title={!user ? "Para ver o contato, faça login." : ""}
              className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-50 text-sm font-medium"
            >
              Ver contato
            </button>
          )}

          {isOwner && (
            <>
              <Link
                to={`/posts/${post.id}/edit`}
                className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-50 text-sm font-medium"
              >
                Editar
              </Link>

              {post.status === "ACTIVE" && (
                <button
                  onClick={handleResolvePost}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 text-sm font-medium disabled:opacity-50"
                >
                  {actionLoading ? "Encerrando..." : "Encerrar anúncio"}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PhotoCarousel photos={orderedPhotos} title={post.name} />

        <div className="rounded-2xl border bg-white p-4 space-y-3">
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
              {typeLabel(post.type)}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
              {post.species}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
              {post.sex}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
              {post.size}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-gray-500">Cor</div>
              <div className="font-medium">{post.color}</div>
            </div>
            <div>
              <div className="text-gray-500">Idade</div>
              <div className="font-medium">{post.age_months ?? "-"} meses</div>
            </div>
            <div>
              <div className="text-gray-500">Peso</div>
              <div className="font-medium">{post.weight_kg ?? "-"} kg</div>
            </div>
            <div>
              <div className="text-gray-500">Status</div>
              <div className="font-medium">{post.status}</div>
            </div>
          </div>

          <div className="pt-2">
            <div className="text-gray-500 text-sm">Descrição</div>
            <div className="text-sm text-gray-800 whitespace-pre-line">
              {post.description}
            </div>
          </div>

          {!isOwner && (
            <div className="pt-3 border-t">
              <div className="text-sm font-medium">Contato do anunciante</div>

              {contact ? (
                <div className="mt-2 flex items-center justify-between gap-3 flex-wrap">
                  <div className="text-sm">
                    WhatsApp:{" "}
                    <span className="font-semibold">{contact.whatsapp}</span>
                  </div>

                  <a
                    className="px-4 py-2 rounded-xl bg-black text-white text-sm font-medium"
                    href={`https://wa.me/${String(contact.whatsapp).replace(
                      /\D/g,
                      "",
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Abrir WhatsApp
                  </a>
                </div>
              ) : (
                <div className="mt-2 text-sm text-gray-600">
                  {contactError ? (
                    <span className="text-red-600">{contactError}</span>
                  ) : actionLoading ? (
                    "Carregando contato..."
                  ) : (
                    "Contato fica disponível após aprovação da visita."
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <RequestVisitModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleRequestVisit}
        loading={actionLoading}
      />
    </Container>
  );
}
