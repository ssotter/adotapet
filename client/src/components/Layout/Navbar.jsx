import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/auth";
import Logo from "../Brand/Logo";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-lg text-sm font-medium ${
          isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

function firstName(user) {
  const raw = user?.name || user?.email || "Usuário";
  return String(raw).trim().split(" ")[0] || "Usuário";
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="border-b bg-[#FFF7F2] border-[#F1E4DB]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Logo subtitle="Rio Grande/RS" />
        </Link>

        <div className="flex items-center gap-2">
          <NavItem to="/">Home</NavItem>

          {user ? (
            <>
              <NavItem to="/requests">Solicitações</NavItem>

              <div className="px-3 py-2 rounded-lg text-sm font-medium bg-white/70 border border-[#F1E4DB] text-gray-700">
                Olá, <span className="font-semibold">{firstName(user)}</span>
              </div>

              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <NavItem to="/login">Entrar</NavItem>
              <NavItem to="/register">Criar conta</NavItem>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
