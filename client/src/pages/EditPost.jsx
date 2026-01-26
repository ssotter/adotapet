import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getPostById,
  updatePost,
  uploadPostPhotos,
  setPostCover,
  deletePostPhoto,
} from "../api/posts";
import { getNeighborhoods } from "../api/neighborhoods";

function toInputDate(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [neighborhoods, setNeighborhoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState("");

  // post completo (inclui photos + cover_photo_id)
  const [post, setPost] = useState(null);

  // upload fotos
  const [photoFiles, setPhotoFiles] = useState([]);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState("");

  // para resetar o input file após upload
  const fileInputRef = useRef(null);

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

  async function loadAll() {
    setError("");
    setPhotoError("");
    setLoadingInitial(true);

    try {
      const [nb, postData] = await Promise.all([getNeighborhoods(), getPostById(id)]);

      setNeighborhoods(nb || []);
      setPost(postData);

      setForm({
        type: postData.type ?? "ADOPTION",
        species: postData.species ?? "DOG",
        name: postData.name ?? "",
        color: postData.color ?? "",
        ageMonths: postData.age_months ?? "",
        weightKg: postData.weight_kg ?? "",
        sex: postData.sex ?? "UNKNOWN",
        size: postData.size ?? "MEDIUM",
        neighborhoodId: postData.neighborhood_id ?? (nb?.[0]?.id || ""),
        description: postData.description ?? "",
        eventDate: toInputDate(postData.event_date),
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
  }

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const coverId = post?.cover_photo_id ?? null;

  const photos = useMemo(() => {
    const list = post?.photos || [];
    return Array.isArray(list) ? list : [];
  }, [post]);

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

  function handleSelectFiles(e) {
    setPhotoError("");
    const selected = Array.from(e.target.files || []);

    if (selected.length === 0) {
      setPhotoFiles([]);
      return;
    }

    // limite do backend: 6 fotos por upload
    if (selected.length > 6) {
      setPhotoError("Você pode enviar no máximo 6 fotos por vez.");
      setPhotoFiles(selected.slice(0, 6));
      return;
    }

    setPhotoFiles(selected);
  }

  async function handleUploadPhotos() {
    setPhotoError("");

    if (!photoFiles || photoFiles.length === 0) {
      setPhotoError("Selecione ao menos uma foto.");
      return;
    }

    setPhotoLoading(true);
    try {
      await uploadPostPhotos(id, photoFiles);

      // limpa seleção + reseta input para permitir selecionar o mesmo arquivo novamente
      setPhotoFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";

      await loadAll(); // recarrega para refletir fotos novas
    } catch (e) {
      setPhotoError(e?.response?.data?.error || "Falha ao enviar fotos.");
    } finally {
      setPhotoLoading(false);
    }
  }

  async function handleSetCover(photoId) {
    setPhotoError("");
    setPhotoLoading(true);
    try {
      await setPostCover(id, photoId);
      await loadAll();
    } catch (e) {
      setPhotoError(e?.response?.data?.error || "Falha ao definir foto de capa.");
    } finally {
      setPhotoLoading(false);
    }
  }

  async function handleDeletePhoto(photoId) {
    const ok = window.confirm("Remover esta foto do anúncio?");
    if (!ok) return;

    setPhotoError("");
    setPhotoLoading(true);
    try {
      await deletePostPhoto(id, photoId);
      await loadAll();
    } catch (e) {
      setPhotoError(e?.response?.data?.error || "Falha ao remover foto.");
    } finally {
      setPhotoLoading(false);
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
          <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800">
            {error}
          </div>
        )}

        {/* =======================
            Fotos do anúncio
        ======================= */}
        <div className="mb-6 rounded-2xl border bg-white p-4">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-lg font-semibold">Fotos do anúncio</h2>
              <p className="text-sm text-gray-600">
                Defina uma foto como capa (aparece na Home e em Meus anúncios).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition cursor-pointer
                ${
                  photoLoading
                    ? "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Selecionar fotos
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleSelectFiles}
                  disabled={photoLoading}
                />
              </label>

              <button
                type="button"
                disabled={photoLoading || photoFiles.length === 0}
                onClick={handleUploadPhotos}
                className={`px-3 py-2 rounded-lg text-sm font-semibold text-white transition
                  ${
                    photoLoading || photoFiles.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black hover:bg-gray-900"
                  }`}
              >
                {photoLoading ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </div>

          {photoFiles.length > 0 && (
            <div className="mt-3 text-sm text-gray-700">
              {photoFiles.length} arquivo(s) selecionado(s).{" "}
              <span className="text-gray-500">(máx. 6 por envio)</span>
            </div>
          )}

          {photoError && (
            <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
              {photoError}
            </div>
          )}

          <div className="mt-4">
            {photos.length === 0 ? (
              <div className="text-sm text-gray-600">
                Nenhuma foto cadastrada ainda. Envie fotos para o anúncio.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {photos.map((ph) => {
                  const isCover = !!coverId && ph.id === coverId;

                  return (
                    <div
                      key={ph.id}
                      className="rounded-xl border overflow-hidden bg-white"
                    >
                      <div className="relative">
                        <img
                          src={ph.url}
                          alt="Foto do pet"
                          className="w-full h-32 object-cover"
                        />

                        {isCover && (
                          <span className="absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded-full bg-black text-white">
                            Capa
                          </span>
                        )}
                      </div>

                      <div className="p-2 flex gap-2">
                        <button
                          type="button"
                          disabled={photoLoading || isCover}
                          onClick={() => handleSetCover(ph.id)}
                          className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold border transition
                            ${
                              photoLoading || isCover
                                ? "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                          {isCover ? "Capa atual" : "Definir capa"}
                        </button>

                        <button
                          type="button"
                          disabled={photoLoading}
                          onClick={() => handleDeletePhoto(ph.id)}
                          className={`px-3 py-2 rounded-lg text-xs font-semibold border transition
                            ${
                              photoLoading
                                ? "border-red-100 text-red-300 bg-red-50 cursor-not-allowed"
                                : "border-red-200 text-red-700 hover:bg-red-50"
                            }`}
                          title="Remover foto"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* =======================
            Formulário
        ======================= */}
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
