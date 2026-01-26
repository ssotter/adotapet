import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Layout/Container";
import { forgotPassword } from "../api/auth";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false); // ✅ evita reenvio e controla redirect
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  async function onSubmit(e) {
    e.preventDefault();

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErr("Informe um e-mail válido.");
      return;
    }

    setErr("");
    setMsg("");
    setLoading(true);

    try {
      const data = await forgotPassword(cleanEmail);

      setMsg(
        data?.message ||
          "Se este e-mail estiver cadastrado, enviaremos instruções para redefinir sua senha."
      );

      setSent(true);

      // ✅ mostra a mensagem e depois manda para Home
      timerRef.current = setTimeout(() => {
        navigate("/", { replace: true });
      }, 1200);
    } catch (e2) {
      setErr(e2?.response?.data?.error || "Não foi possível enviar o e-mail.");
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
              disabled={loading || sent}
            />
          </div>

          {msg && (
            <div className="p-3 rounded-xl border bg-white text-sm text-gray-700">
              {msg} <span className="text-gray-500">Redirecionando...</span>
            </div>
          )}

          {err && (
            <div className="p-3 rounded-xl border bg-white text-sm text-red-600">
              {String(err)}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || sent}
            className="w-full px-4 py-2 rounded-xl bg-black text-white text-sm font-medium disabled:opacity-60"
          >
            {loading ? "Enviando..." : sent ? "Enviado" : "Enviar link"}
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
