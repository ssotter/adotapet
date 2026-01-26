import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../components/Layout/Container";
import { uploadMyAvatar } from "../api/users";
import { useAuth } from "../store/auth";

function initialsFrom(user) {
  const raw = (user?.name || user?.email || "U").trim();
  const parts = raw.split(/\s+/).filter(Boolean);
  const ini = parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
  return ini || "U";
}

export default function Profile() {
  const { user, setUser } = useAuth();
  const fileRef = useRef(null);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const initials = useMemo(() => initialsFrom(user), [user]);

  function onPick(e) {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setPreview(URL.createObjectURL(f));
    setMsg("");
    setErr("");
  }

  async function onUpload() {
    if (!file) return;

    setLoading(true);
    setMsg("");
    setErr("");

    try {
      const updatedUser = await uploadMyAvatar(file);

      // atualiza o user global
      setUser(updatedUser);

      setMsg("Avatar atualizado com sucesso!");
      setFile(null);
      setPreview(null);

      if (fileRef.current) fileRef.current.value = "";
    } catch (e) {
      setErr(e?.response?.data?.error || "Falha ao enviar avatar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <h1 className="text-2xl font-semibold">Meu perfil</h1>
      <p className="text-sm text-gray-600 mt-1">
        Envie uma foto para aparecer na barra superior.
      </p>

      <div className="mt-6 rounded-2xl border bg-white p-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 border grid place-items-center">
            {preview || user?.avatar_url ? (
              <img
                src={preview || user.avatar_url}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-semibold text-gray-700">{initials}</span>
            )}
          </div>

          <div className="min-w-0">
            <div className="font-semibold">{user?.name}</div>
            <div className="text-sm text-gray-600 truncate">{user?.email}</div>
            <div className="text-sm text-gray-600">{user?.whatsapp}</div>
          </div>
        </div>

        {/* input real escondido */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={onPick}
          className="hidden"
        />

        <div className="mt-5 flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-50 text-sm font-medium"
          >
            Escolher foto
          </button>

          {file?.name ? (
            <span className="text-sm text-gray-600 truncate max-w-[260px]">
              {file.name}
            </span>
          ) : null}
        </div>

        <button
          onClick={onUpload}
          disabled={!file || loading}
          className="mt-4 px-4 py-2 rounded-xl bg-black text-white text-sm font-medium disabled:opacity-60"
        >
          {loading ? "Enviando..." : "Salvar avatar"}
        </button>

        {msg && (
          <div className="mt-3 p-3 rounded-xl border bg-green-50 text-sm text-green-700">
            {msg}
          </div>
        )}

        {err && (
          <div className="mt-3 p-3 rounded-xl border bg-red-50 text-sm text-red-600">
            {err}
          </div>
        )}
      </div>

      {/* Segurança */}
      <div className="mt-4 rounded-2xl border bg-white p-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="font-semibold">Segurança</div>
            <div className="text-sm text-gray-600">
              Altere sua senha sempre que necessário.
            </div>
          </div>

          <Link
            to="/change-password"
            className="px-4 py-2 rounded-xl bg-black text-white text-sm font-medium"
          >
            Alterar senha
          </Link>
        </div>
      </div>
    </Container>
  );
}
