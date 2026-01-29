import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/Layout/Container";
import { changeMyPassword } from "../api/auth";
import { useAuth } from "../store/auth";
import { useToast } from "../components/Toast.jsx";

export default function ChangePassword() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

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
      toast.info("Faça login para alterar sua senha.");
      navigate("/login");
      return;
    }

    if (newPassword.length < 6) {
      setErr("A nova senha deve ter pelo menos 6 caracteres.");
      toast.error("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirm) {
      setErr("As senhas não conferem.");
      toast.error("As senhas não conferem.");
      return;
    }

    setLoading(true);
    try {
      const data = await changeMyPassword(currentPassword, newPassword);

      const okMsg = data?.message || "Senha alterada com sucesso.";
      setMsg(okMsg);

      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");

      toast.success(okMsg);

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 700);
    } catch (e2) {
      const m = e2?.response?.data?.error || "Não foi possível alterar a senha.";
      setErr(m);
      toast.error(m);
    } finally {
      setLoading(false);
    }
  }

  const locked = loading || Boolean(msg);

  return (
    <Container>
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Alterar senha</h1>
            <p className="text-sm text-gray-600 mt-1">
              Para sua segurança, confirme sua senha atual.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="px-3 py-2 rounded-xl border bg-white hover:bg-gray-50 text-sm font-medium"
          >
            Voltar
          </button>
        </div>

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
              disabled={locked}
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
              disabled={locked}
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
              disabled={locked}
            />
          </div>

          {msg && (
            <div className="p-3 rounded-xl border bg-white text-sm text-gray-700">
              {msg} Redirecionando para Home...
            </div>
          )}

          {err && (
            <div className="p-3 rounded-xl border bg-white text-sm text-red-600">
              {String(err)}
            </div>
          )}

          <button
            type="submit"
            disabled={locked}
            className="w-full px-4 py-2 rounded-xl bg-black text-white text-sm font-medium disabled:opacity-60"
          >
            {loading ? "Salvando..." : "Alterar senha"}
          </button>
        </form>
      </div>
    </Container>
  );
}
