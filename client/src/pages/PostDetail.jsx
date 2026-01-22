import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from "../components/Layout/Container";
import PhotoCarousel from "../components/Posts/PhotoCarousel";
import RequestVisitModal from "../components/Posts/RequestVisitModal";
import { getPostById, getPostContact, requestVisit } from "../api/posts";
import { useAuth } from "../store/auth";

function typeLabel(type) {
  return type === "FOUND_LOST" ? "Encontrado/Perdido" : "Adoção";
}

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [contact, setContact] = useState(null); // {whatsapp, allowed}
  const [contactError, setContactError] = useState(null);

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

  async function handleRequestVisit(message) {
    if (!user) {
      navigate("/login");
      return;
    }

    setActionLoading(true);
    try {
      await requestVisit(id, message);
      setOpenModal(false);
      alert("Pedido enviado! Aguarde aprovação do anunciante.");
    } catch (e) {
      alert(e?.response?.data?.error || "Falha ao solicitar visita");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleGetContact() {
    if (!user) {
      navigate("/login");
      return;
    }

    setContactError(null);
    setActionLoading(true);
    try {
      const data = await getPostContact(id);
      setContact(data);
    } catch (e) {
      setContact(null);
      setContactError(e?.response?.data?.error || "Não foi possível obter o contato");
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return (
      <Container>
        <div className="p-4 rounded-2xl border bg-white text-sm text-gray-500">Carregando...</div>
      </Container>
    );
  }

  if (err) {
    return (
      <Container>
        <div className="p-4 rounded-2xl border bg-white text-sm text-red-600">{String(err)}</div>
      </Container>
    );
  }

  if (!post) return null;

  return (
    <Container>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">{post.name}</h1>
          <div className="text-sm text-gray-600">
            {post.neighborhood} • {typeLabel(post.type)}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setOpenModal(true)}
            className="px-4 py-2 rounded-xl bg-black text-white text-sm font-medium"
          >
            Solicitar visita
          </button>

          <button
            onClick={handleGetContact}
            className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-50 text-sm font-medium"
          >
            Ver contato
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PhotoCarousel photos={post.photos} title={post.name} />

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
              <div className="font-medium">{post.age_months} meses</div>
            </div>
            <div>
              <div className="text-gray-500">Peso</div>
              <div className="font-medium">{post.weight_kg} kg</div>
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

          <div className="pt-3 border-t">
            <div className="text-sm font-medium">Contato do anunciante</div>

            {contact ? (
              <div className="mt-2 flex items-center justify-between gap-3">
                <div className="text-sm">
                  WhatsApp: <span className="font-semibold">{contact.whatsapp}</span>
                </div>

                <a
                  className="px-4 py-2 rounded-xl bg-black text-white text-sm font-medium"
                  href={`https://wa.me/${contact.whatsapp}`}
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
                ) : (
                  "Contato fica disponível após aprovação da visita."
                )}
              </div>
            )}
          </div>
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
