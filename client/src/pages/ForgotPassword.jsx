import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Layout/Container";
import { forgotPassword } from "../api/auth";
import { useToast } from "../components/Toast.jsx";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const clean = email.trim();

    if (!clean) {
      toast.error("Informe seu e-mail.");
      return;
    }

    setLoading(true);
    try {
      const data = await forgotPassword(clean);
      toast.success(data?.message || "Se o e-mail existir, enviaremos instruções.");

      // ✅ volta pra Home
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 800);
    } catch (e2) {
      toast.error(e2?.response?.data?.error || "Não foi possível enviar o e-mail.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-semibold">Esqueci minha senha</h1>
        <p className="text-sm text-gray-600 mt-1">
          Informe seu e-mail para receber um link de redefinição.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-6 rounded-2xl border bg-white p-4 space-y-3"
        >
          <div>
            <label className="text-xs font-medium text-gray-600">E-mail</label>
            <input
              className="mt-1 w-full border rounded-xl px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              type="email"
              autoComplete="email"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 rounded-xl bg-black text-white text-sm font-medium disabled:opacity-60"
          >
            {loading ? "Enviando..." : "Enviar link"}
          </button>

          <div className="text-sm text-gray-600 text-center">
            Lembrou a senha?{" "}
            <Link to="/login" className="font-medium underline">
              Entrar
            </Link>
          </div>
        </form>
      </div>
    </Container>
  );
}
