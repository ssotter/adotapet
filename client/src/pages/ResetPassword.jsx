import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Container from "../components/Layout/Container";
import { resetPassword } from "../api/auth";
import { useToast } from "../components/Toast.jsx";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";

  const navigate = useNavigate();
  const toast = useToast();

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();

    if (!token) {
      toast.error("Token inválido ou ausente.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirm) {
      toast.error("As senhas não conferem.");
      return;
    }

    setLoading(true);
    try {
      const data = await resetPassword(token, newPassword);
      toast.success(data?.message || "Senha redefinida com sucesso!");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 900);
    } catch (e2) {
      toast.error(e2?.response?.data?.error || "Não foi possível redefinir a senha.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-semibold">Redefinir senha</h1>
        <p className="text-sm text-gray-600 mt-1">
          Escolha uma nova senha para sua conta.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-6 rounded-2xl border bg-white p-4 space-y-3"
        >
          <div>
            <label className="text-xs font-medium text-gray-600">Nova senha</label>
            <input
              className="mt-1 w-full border rounded-xl px-3 py-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              autoComplete="new-password"
              required
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 rounded-xl bg-black text-white text-sm font-medium disabled:opacity-60"
          >
            {loading ? "Salvando..." : "Redefinir senha"}
          </button>

          <div className="text-sm text-gray-600 text-center">
            Voltar para{" "}
            <Link to="/login" className="font-medium underline">
              login
            </Link>
          </div>
        </form>
      </div>
    </Container>
  );
}
