import { useId, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "../components/Layout/Container";
import { useAuth } from "../store/auth";
import { useToast } from "../components/Toast.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const emailId = useId();
  const passwordId = useId();

  // ✅ se veio do ProtectedRoute, ele manda state={{from: location}}
  const from = location.state?.from?.pathname || "/";

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success("Login realizado com sucesso!");
      navigate(from, { replace: true });
    } catch (err) {
      const m = err?.response?.data?.error || "Falha no login";
      toast.error(String(m));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <div className="max-w-md">
        <h1 className="text-2xl font-semibold">Entrar</h1>
        <p className="text-gray-600 text-sm">
          Acesse para solicitar visitas e ver contato.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-6 p-4 rounded-2xl border bg-white space-y-3"
        >
          <div>
            <label className="text-sm font-medium" htmlFor={emailId}>
              Email
            </label>
            <input
              id={emailId}
              className="mt-1 w-full border rounded-xl px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              type="email"
              autoComplete="email"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor={passwordId}>
              Senha
            </label>
            <input
              id={passwordId}
              className="mt-1 w-full border rounded-xl px-3 py-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******"
              autoComplete="current-password"
              required
              disabled={loading}
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-black text-white rounded-xl py-2 font-medium disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className="text-sm text-gray-600 text-center">
            Esqueceu a senha?{" "}
            <Link to="/forgot-password" className="font-medium underline">
              Recuperar
            </Link>
          </div>

          <div className="text-sm text-gray-600 text-center">
            Não tem conta?{" "}
            <Link to="/register" className="font-medium underline">
              Criar conta
            </Link>
          </div>
        </form>
      </div>
    </Container>
  );
}
