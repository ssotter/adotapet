import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPostById, updatePost } from "../api/posts";
import { getNeighborhoods } from "../api/neighborhoods";

function toInputDate(value) {
  if (!value) return "";
  // aceita "2026-01-21T..." ou "2026-01-21"
  return String(value).slice(0, 10);
}

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [neighborhoods, setNeighborhoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    type: "ADOPTION",
    species: "DOG",
    name: "",
    color: "",
    ageMonths: "",
    weightKg: "",
    sex: "UNKNOWN",
    size: "MEDIUM",
    neighborhoodId: "",
    description: "",
    eventDate: "",
  });

  useEffect(() => {
    (async () => {
      setError("");
      setLoadingInitial(true);

      try {
        const [nb, post] = await Promise.all([getNeighborhoods(), getPostById(id)]);

        setNeighborhoods(nb || []);

        // mapeia snake_case do backend -> camelCase do form
        setForm({
          type: post.type ?? "ADOPTION",
          species: post.species ?? "DOG",
          name: post.name ?? "",
          color: post.color ?? "",
          ageMonths: post.age_months ?? "",
          weightKg: post.weight_kg ?? "",
          sex: post.sex ?? "UNKNOWN",
          size: post.size ?? "MEDIUM",
          neighborhoodId: post.neighborhood_id ?? (nb?.[0]?.id || ""),
          description: post.description ?? "",
          eventDate: toInputDate(post.event_date),
        });
      } catch (e) {
        const msg =
          e?.response?.data?.error ||
          e?.message ||
          "Não foi possível carregar o anúncio.";
        setError(msg);
      } finally {
        setLoadingInitial(false);
      }
    })();
  }, [id]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...form,
        ageMonths: form.ageMonths === "" ? null : Number(form.ageMonths),
        weightKg: form.weightKg === "" ? null : Number(form.weightKg),
        eventDate: form.type === "FOUND_LOST" ? (form.eventDate || null) : null,
      };

      const updated = await updatePost(id, payload);
      navigate(`/posts/${updated.id || id}`);
    } catch (e) {
      const msg =
        e?.response?.data?.error ||
        e?.message ||
        "Erro ao atualizar anúncio.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  if (loadingInitial) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <p className="text-gray-600">Carregando anúncio...</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">Editar anúncio</h1>

        {error && (
          <div className="mb-3 p-3 rounded bg-red-100 text-red-800">{error}</div>
        )}

        <form id="edit-post-form" onSubmit={onSubmit} className="space-y-3 pb-28">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm block mb-1">Tipo</label>
              <select
                name="type"
                value={form.type}
                onChange={onChange}
                className="border rounded p-2 w-full"
              >
                <option value="ADOPTION">Adoção</option>
                <option value="FOUND_LOST">Encontrado/Perdido</option>
              </select>
            </div>

            <div>
              <label className="text-sm block mb-1">Espécie</label>
              <select
                name="species"
                value={form.species}
                onChange={onChange}
                className="border rounded p-2 w-full"
              >
                <option value="DOG">Cachorro</option>
                <option value="CAT">Gato</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm block mb-1">Nome (opcional)</label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className="border rounded p-2 w-full"
              placeholder="Ex.: Thor"
            />
          </div>

          <div>
            <label className="text-sm block mb-1">Cor</label>
            <input
              name="color"
              value={form.color}
              onChange={onChange}
              className="border rounded p-2 w-full"
              placeholder="Ex.: Caramelo"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm block mb-1">Idade (meses)</label>
              <input
                name="ageMonths"
                value={form.ageMonths}
                onChange={onChange}
                className="border rounded p-2 w-full"
                placeholder="Ex.: 24"
                inputMode="numeric"
              />
            </div>

            <div>
              <label className="text-sm block mb-1">Peso (kg)</label>
              <input
                name="weightKg"
                value={form.weightKg}
                onChange={onChange}
                className="border rounded p-2 w-full"
                placeholder="Ex.: 12.5"
                inputMode="decimal"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm block mb-1">Sexo</label>
              <select
                name="sex"
                value={form.sex}
                onChange={onChange}
                className="border rounded p-2 w-full"
              >
                <option value="UNKNOWN">Não informado</option>
                <option value="M">Macho</option>
                <option value="F">Fêmea</option>
              </select>
            </div>

            <div>
              <label className="text-sm block mb-1">Porte</label>
              <select
                name="size"
                value={form.size}
                onChange={onChange}
                className="border rounded p-2 w-full"
              >
                <option value="SMALL">Pequeno</option>
                <option value="MEDIUM">Médio</option>
                <option value="LARGE">Grande</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm block mb-1">Bairro</label>
            <select
              name="neighborhoodId"
              value={form.neighborhoodId}
              onChange={onChange}
              className="border rounded p-2 w-full"
              required
            >
              {neighborhoods.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name}
                </option>
              ))}
            </select>
          </div>

          {form.type === "FOUND_LOST" && (
            <div>
              <label className="text-sm block mb-1">Data do evento</label>
              <input
                type="date"
                name="eventDate"
                value={form.eventDate}
                onChange={onChange}
                className="border rounded p-2 w-full"
                required
              />
            </div>
          )}

          <div>
            <label className="text-sm block mb-1">Descrição</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              className="border rounded p-2 w-full min-h-[120px]"
              required
            />
          </div>
        </form>
      </div>

      {/* Barra fixa */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/95 backdrop-blur">
        <div className="max-w-2xl mx-auto p-4 flex gap-3">
          <button
            type="button"
            onClick={() => navigate(`/posts/${id}`)}
            className="w-1/3 px-4 py-3 rounded-lg font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>

          <button
            form="edit-post-form"
            type="submit"
            disabled={loading}
            className={`w-2/3 px-4 py-3 rounded-lg font-semibold text-white transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-900"
            }`}
          >
            {loading ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </div>
    </>
  );
}
