import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/auth";
import Logo from "../Brand/Logo";

function NavItem({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `px-3 py-2 rounded-lg text-sm font-medium transition ${
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

function HamburgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <div className="border-b bg-[#FFF7F2] border-[#F1E4DB] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2">
          <NavItem to="/">Home</NavItem>

          {user ? (
            <>
              <NavItem to="/my-posts">Meus anúncios</NavItem>
              <NavItem to="/posts/new">Cadastrar pet</NavItem>
              <NavItem to="/favorites">❤️ Favoritos</NavItem>
              <NavItem to="/requests">Solicitações</NavItem>
              <NavItem to="/my-requests">Minhas solicitações</NavItem>

              <button
                onClick={() => navigate("/profile")}
                className="ml-1 rounded-xl hover:bg-white/60 p-1"
                title="Meu perfil"
              >
                <Avatar user={user} />
              </button>

              <button
                onClick={handleLogout}
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

          {/* ✅ Sobre por último */}
          <NavItem to="/sobre">Sobre</NavItem>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 hover:bg-white/60"
          onClick={() => setOpen(true)}
          aria-label="Abrir menu"
        >
          <HamburgerIcon />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
          />

          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-[#FFF7F2] border-l border-[#F1E4DB] shadow-xl p-4 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#6B3F2B]">Menu</span>
              <button
                className="w-10 h-10 rounded-lg hover:bg-white/60 inline-flex items-center justify-center text-gray-700"
                onClick={() => setOpen(false)}
                aria-label="Fechar"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="mt-3 border-t border-[#F1E4DB] pt-3 flex flex-col gap-1">
              <NavItem to="/" onClick={() => setOpen(false)}>
                Home
              </NavItem>

              {user ? (
                <>
                  <NavItem to="/my-posts" onClick={() => setOpen(false)}>
                    Meus anúncios
                  </NavItem>
                  <NavItem to="/posts/new" onClick={() => setOpen(false)}>
                    Cadastrar pet
                  </NavItem>
                  <NavItem to="/favorites" onClick={() => setOpen(false)}>
                    ❤️ Favoritos
                  </NavItem>
                  <NavItem to="/requests" onClick={() => setOpen(false)}>
                    Solicitações
                  </NavItem>
                  <NavItem to="/my-requests" onClick={() => setOpen(false)}>
                    Minhas solicitações
                  </NavItem>
                </>
              ) : (
                <>
                  <NavItem to="/login" onClick={() => setOpen(false)}>
                    Entrar
                  </NavItem>
                  <NavItem to="/register" onClick={() => setOpen(false)}>
                    Criar conta
                  </NavItem>
                </>
              )}

              {/* ✅ Sobre por último no mobile */}
              <NavItem to="/sobre" onClick={() => setOpen(false)}>
                Sobre
              </NavItem>
            </div>

            <div className="mt-auto pt-4 border-t border-[#F1E4DB]">
              {user ? (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => go("/profile")}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-white/60"
                  >
                    <Avatar user={user} />
                    Meu perfil
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-white/60 text-left"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  Você não está logado.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
