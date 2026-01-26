import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Container from "../components/Layout/Container";
import { useAuth } from "../store/auth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("sergio@adotapet.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.error || "Falha no login");
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
            <label className="text-sm font-medium">Email</label>
            <input
              className="mt-1 w-full border rounded-xl px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Senha</label>
            <input
              className="mt-1 w-full border rounded-xl px-3 py-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******"
              autoComplete="current-password"
            />
          </div>

          {error && <div className="text-sm text-red-600">{String(error)}</div>}

          <button
            disabled={loading}
            className="w-full bg-black text-white rounded-xl py-2 font-medium disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className="pt-2 flex items-center justify-between text-sm">
            <Link to="/forgot-password" className="text-gray-700 hover:underline">
              Esqueci minha senha
            </Link>
            <Link to="/register" className="text-gray-700 hover:underline">
              Criar conta
            </Link>
          </div>
        </form>
      </div>
    </Container>
  );
}
