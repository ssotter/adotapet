import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/Layout/Container";
import { useAuth } from "../store/auth";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    whatsapp: "",
  });
  const [error, setError] = useState(null);

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.error || "Falha no cadastro");
    }
  }

  return (
    <Container>
      <div className="max-w-md">
        <h1 className="text-2xl font-semibold">Criar conta</h1>
        <p className="text-gray-600 text-sm">Faça seu cadastro para anunciar e solicitar visitas.</p>

        <form onSubmit={onSubmit} className="mt-6 p-4 rounded-2xl border bg-white space-y-3">
          <div>
            <label className="text-sm font-medium">Nome</label>
            <input
              className="mt-1 w-full border rounded-xl px-3 py-2"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              className="mt-1 w-full border rounded-xl px-3 py-2"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Senha</label>
            <input
              className="mt-1 w-full border rounded-xl px-3 py-2"
              type="password"
              value={form.password}
              onChange={(e) => setField("password", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">WhatsApp</label>
            <input
              className="mt-1 w-full border rounded-xl px-3 py-2"
              value={form.whatsapp}
              onChange={(e) => setField("whatsapp", e.target.value)}
              placeholder="55999999999"
            />
          </div>

          {error && <div className="text-sm text-red-600">{String(error)}</div>}

          <button className="w-full bg-black text-white rounded-xl py-2 font-medium">
            Criar conta
          </button>
        </form>
      </div>
    </Container>
  );
}
