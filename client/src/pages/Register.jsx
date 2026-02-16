import { useId, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../components/Layout/Container";
import { useAuth } from "../store/auth";
import { useToast } from "../components/Toast.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const nameId = useId();
  const emailId = useId();
  const whatsappId = useId();
  const passwordId = useId();

  async function onSubmit(e) {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, whatsapp, password });
      toast.success("Conta criada com sucesso!");
      navigate("/", { replace: true });
    } catch (err) {
      const m = err?.response?.data?.error || "Falha ao criar conta";
      toast.error(String(m));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <div className="max-w-md">
        <h1 className="text-2xl font-semibold">Criar conta</h1>
        <p className="text-gray-600 text-sm">
          Cadastre-se para solicitar visitas e ver contato.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-6 p-4 rounded-2xl border bg-white space-y-3"
        >
          <div>
            <label className="text-sm font-medium" htmlFor={nameId}>
              Nome
            </label>
            <input
              id={nameId}
              className="mt-1 w-full border rounded-xl px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor={emailId}>
              Email
            </label>
            <input
              id={emailId}
              className="mt-1 w-full border rounded-xl px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm font-medium" htmlFor={whatsappId}>
              WhatsApp
            </label>
            <input
              id={whatsappId}
              className="mt-1 w-full border rounded-xl px-3 py-2"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="new-password"
              required
              disabled={loading}
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-black text-white rounded-xl py-2 font-medium disabled:opacity-60"
          >
            {loading ? "Criando..." : "Criar conta"}
          </button>

          <div className="text-sm text-gray-600 text-center">
            Já tem conta?{" "}
            <Link to="/login" className="font-medium underline">
              Entrar
            </Link>
          </div>
        </form>
      </div>
    </Container>
  );
}
