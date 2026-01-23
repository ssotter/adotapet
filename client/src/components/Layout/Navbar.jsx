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

function initialsFrom(user) {
  const raw = (user?.name || user?.email || "U").trim();
  const parts = raw.split(/\s+/).filter(Boolean);
  const ini = parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
  return ini || "U";
}

function Avatar({ user }) {
  const initials = initialsFrom(user);

  return (
    <div className="w-10 h-10 rounded-full overflow-hidden bg-white/70 border border-[#F1E4DB] grid place-items-center">
      {user?.avatar_url ? (
        <img
          src={user.avatar_url}
          alt={user?.name || "Avatar"}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-sm font-semibold text-gray-700">{initials}</span>
      )}
    </div>
  );
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

              {/* Avatar clicável (vai para /profile) */}
              <button
                onClick={() => navigate("/profile")}
                className="ml-1 rounded-xl hover:bg-white/60 p-1"
                title="Meu perfil"
              >
                <Avatar user={user} />
              </button>

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
