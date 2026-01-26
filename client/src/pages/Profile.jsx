import { useMemo, useState } from "react";
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
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const initials = useMemo(() => initialsFrom(user), [user]);

  function onPick(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function onUpload() {
    if (!file) return;

    setLoading(true);
    try {
      const updatedUser = await uploadMyAvatar(file);

      // atualiza o user global -> Navbar atualiza na hora
      setUser(updatedUser);

      alert("Avatar atualizado com sucesso!");
      setFile(null);
      setPreview(null);
    } catch (e) {
      alert(e?.response?.data?.error || "Falha ao enviar avatar");
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

        <div className="mt-5">
          <input
            type="file"
            accept="image/*"
            onChange={onPick}
            className="block w-full text-sm"
          />
        </div>

        <button
          onClick={onUpload}
          disabled={!file || loading}
          className="mt-4 px-4 py-2 rounded-xl bg-black text-white text-sm font-medium disabled:opacity-60"
        >
          {loading ? "Enviando..." : "Salvar avatar"}
        </button>

        <div className="mt-3 text-xs text-gray-500"></div>
      </div>

      {/* ✅ NOVO: Segurança */}
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
