import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Container from "../components/Layout/Container";
import { resetPassword } from "../api/auth";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = useMemo(() => params.get("token") || "", [params]);

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!token) {
      setErr("Token ausente. Abra o link enviado para o seu e-mail.");
    }
  }, [token]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");

    if (!token) {
      setErr("Token ausente.");
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
      const data = await resetPassword(token, newPassword);
      setMsg(data?.message || "Senha redefinida com sucesso.");
      // leva para login após sucesso
      setTimeout(() => navigate("/login"), 900);
    } catch (e2) {
      setErr(e2?.response?.data?.error || "Não foi possível redefinir a senha.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-semibold">Redefinir senha</h1>
        <p className="text-sm text-gray-600 mt-1">
          Crie uma nova senha para sua conta.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-6 rounded-2xl border bg-white p-4 space-y-3"
        >
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
              {msg} Indo para login...
            </div>
          )}

          {err && (
            <div className="p-3 rounded-xl border bg-white text-sm text-red-600">
              {String(err)}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full px-4 py-2 rounded-xl bg-black text-white text-sm font-medium disabled:opacity-60"
          >
            {loading ? "Salvando..." : "Redefinir senha"}
          </button>

          <div className="text-sm text-gray-600 text-center">
            <Link to="/forgot-password" className="font-medium underline">
              Pedir novo link
            </Link>
          </div>
        </form>
      </div>
    </Container>
  );
}
