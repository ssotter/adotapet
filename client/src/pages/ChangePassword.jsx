import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/Layout/Container";
import { changeMyPassword } from "../api/auth";
import { useAuth } from "../store/auth";

export default function ChangePassword() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (!user) {
      navigate("/login");
      return;
    }

    if (newPassword.length < 6) {
      setErr("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirm) {
      setErr("As senhas não conferem.");
      return;
    }

    setLoading(true);
    try {
      const data = await changeMyPassword(currentPassword, newPassword);
      setMsg(data?.message || "Senha alterada com sucesso.");

      // opcional: força re-login por segurança
      setTimeout(() => {
        logout();
        navigate("/login");
      }, 900);
    } catch (e2) {
      setErr(e2?.response?.data?.error || "Não foi possível alterar a senha.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-semibold">Alterar senha</h1>
        <p className="text-sm text-gray-600 mt-1">
          Para sua segurança, confirme sua senha atual.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-6 rounded-2xl border bg-white p-4 space-y-3"
        >
          <div>
            <label className="text-xs font-medium text-gray-600">
              Senha atual
            </label>
            <input
              className="mt-1 w-full border rounded-xl px-3 py-2"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600">
              Nova senha
            </label>
            <input
              className="mt-1 w-full border rounded-xl px-3 py-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              autoComplete="new-password"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600">
              Confirmar nova senha
            </label>
            <input
              className="mt-1 w-full border rounded-xl px-3 py-2"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              type="password"
              autoComplete="new-password"
              required
            />
          </div>

          {msg && (
            <div className="p-3 rounded-xl border bg-white text-sm text-gray-700">
              {msg} Redirecionando para login...
            </div>
          )}

          {err && (
            <div className="p-3 rounded-xl border bg-white text-sm text-red-600">
              {String(err)}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 rounded-xl bg-black text-white text-sm font-medium disabled:opacity-60"
          >
            {loading ? "Salvando..." : "Alterar senha"}
          </button>
        </form>
      </div>
    </Container>
  );
}
