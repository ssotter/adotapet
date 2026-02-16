import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ProtectedRoute from "./ProtectedRoute.jsx";

vi.mock("../store/auth", () => ({
  useAuth: vi.fn()
}));

vi.mock("react-router-dom", () => ({
  Navigate: ({ to }) => <div aria-label={`navigate-${to}`} />,
  useLocation: () => ({ pathname: "/perfil" })
}));

vi.mock("./Layout/Container", () => ({
  default: ({ children }) => <div data-testid="container">{children}</div>
}));

const { useAuth } = await import("../store/auth");

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exibe estado de carregamento quando loading=true", () => {
    useAuth.mockReturnValue({ user: null, loading: true });

    render(
      <ProtectedRoute>
        <p>privado</p>
      </ProtectedRoute>
    );

    expect(screen.getByText("Carregando...")).toBeInTheDocument();
    expect(screen.getByTestId("container")).toBeInTheDocument();
  });

  it("redireciona para login quando nao ha usuario", () => {
    useAuth.mockReturnValue({ user: null, loading: false });

    render(
      <ProtectedRoute>
        <p>privado</p>
      </ProtectedRoute>
    );

    expect(screen.getByLabelText("navigate-/login")).toBeInTheDocument();
  });

  it("renderiza filhos quando autenticado", () => {
    useAuth.mockReturnValue({ user: { id: "1" }, loading: false });

    render(
      <ProtectedRoute>
        <p>privado</p>
      </ProtectedRoute>
    );

    expect(screen.getByText("privado")).toBeInTheDocument();
  });
});
