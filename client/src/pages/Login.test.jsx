import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Login from "./Login.jsx";

const mockUseAuth = vi.fn();
const mockUseToast = vi.fn();
const mockNavigate = vi.fn();
let locationState;

vi.mock("../store/auth", () => ({
  useAuth: () => mockUseAuth()
}));

vi.mock("../components/Toast.jsx", () => ({
  useToast: () => mockUseToast()
}));

vi.mock("../components/Layout/Container", () => ({
  default: ({ children }) => <div data-testid="container">{children}</div>
}));

vi.mock("react-router-dom", () => ({
  Link: ({ children, ...props }) => (
    <a {...props} data-testid="router-link">
      {children}
    </a>
  ),
  useNavigate: () => mockNavigate,
  useLocation: () => locationState ?? {}
}));

function fillForm({ email = "user@example.com", password = "123456" } = {}) {
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: email }
  });
  fireEvent.change(screen.getByLabelText(/senha/i), {
    target: { value: password }
  });
}

describe("Login page", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockUseAuth.mockReset();
    mockUseToast.mockReset();
    locationState = { state: { from: { pathname: "/favoritos" } } };
  });

  it("envia credenciais com sucesso e redireciona para rota de origem", async () => {
    const login = vi.fn().mockResolvedValue();
    mockUseAuth.mockReturnValue({ login });
    const toast = { success: vi.fn(), error: vi.fn() };
    mockUseToast.mockReturnValue(toast);

    render(<Login />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => expect(login).toHaveBeenCalledWith("user@example.com", "123456"));
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Login realizado com sucesso!"));
    expect(mockNavigate).toHaveBeenCalledWith("/favoritos", { replace: true });
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("mostra fallback '/' quando nao existe origem", async () => {
    locationState = {};
    const login = vi.fn().mockResolvedValue();
    mockUseAuth.mockReturnValue({ login });
    const toast = { success: vi.fn(), error: vi.fn() };
    mockUseToast.mockReturnValue(toast);

    render(<Login />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true }));
  });

  it("exibe erro do backend quando login falha", async () => {
    const login = vi.fn().mockRejectedValue({
      response: { data: { error: "Credenciais inválidas" } }
    });
    mockUseAuth.mockReturnValue({ login });
    const toast = { success: vi.fn(), error: vi.fn() };
    mockUseToast.mockReturnValue(toast);

    render(<Login />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Credenciais inválidas"));
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("desabilita botao e mostra estado de carregamento enquanto autentica", async () => {
    const pendingPromise = new Promise(() => {});
    const login = vi.fn().mockReturnValue(pendingPromise);
    mockUseAuth.mockReturnValue({ login });
    const toast = { success: vi.fn(), error: vi.fn() };
    mockUseToast.mockReturnValue(toast);

    render(<Login />);
    fillForm();
    const button = screen.getByRole("button", { name: /entrar/i });
    fireEvent.click(button);

    await waitFor(() => expect(button).toBeDisabled());
    expect(button).toHaveTextContent("Entrando...");
  });
});
