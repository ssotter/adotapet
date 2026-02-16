import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Register from "./Register.jsx";

const mockUseAuth = vi.fn();
const mockUseToast = vi.fn();
const mockNavigate = vi.fn();

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
  useNavigate: () => mockNavigate
}));

function fillForm(
  {
    name = "Maria",
    email = "maria@example.com",
    whatsapp = "41999999999",
    password = "123456"
  } = {}
) {
  fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: name } });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: email } });
  fireEvent.change(screen.getByLabelText(/whatsapp/i), {
    target: { value: whatsapp }
  });
  fireEvent.change(screen.getByLabelText(/senha/i), {
    target: { value: password }
  });
}

describe("Register page", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockUseAuth.mockReset();
    mockUseToast.mockReset();
  });

  it("cria conta e redireciona para home", async () => {
    const registerFn = vi.fn().mockResolvedValue();
    mockUseAuth.mockReturnValue({ register: registerFn });
    const toast = { success: vi.fn(), error: vi.fn() };
    mockUseToast.mockReturnValue(toast);

    render(<Register />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /criar conta/i }));

    await waitFor(() =>
      expect(registerFn).toHaveBeenCalledWith({
        name: "Maria",
        email: "maria@example.com",
        whatsapp: "41999999999",
        password: "123456"
      })
    );
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Conta criada com sucesso!"));
    expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
  });

  it("valida tamanho minimo da senha antes de enviar", () => {
    const registerFn = vi.fn();
    mockUseAuth.mockReturnValue({ register: registerFn });
    const toast = { success: vi.fn(), error: vi.fn() };
    mockUseToast.mockReturnValue(toast);

    render(<Register />);
    fillForm({ password: "123" });
    fireEvent.click(screen.getByRole("button", { name: /criar conta/i }));

    expect(toast.error).toHaveBeenCalledWith("A senha deve ter pelo menos 6 caracteres.");
    expect(registerFn).not.toHaveBeenCalled();
  });

  it("propaga erros vindos da API", async () => {
    const registerFn = vi.fn().mockRejectedValue({
      response: { data: { error: "Email já cadastrado" } }
    });
    mockUseAuth.mockReturnValue({ register: registerFn });
    const toast = { success: vi.fn(), error: vi.fn() };
    mockUseToast.mockReturnValue(toast);

    render(<Register />);
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: /criar conta/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Email já cadastrado"));
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("desabilita botao enquanto request esta em andamento", async () => {
    const pendingPromise = new Promise(() => {});
    const registerFn = vi.fn().mockReturnValue(pendingPromise);
    mockUseAuth.mockReturnValue({ register: registerFn });
    const toast = { success: vi.fn(), error: vi.fn() };
    mockUseToast.mockReturnValue(toast);

    render(<Register />);
    fillForm();
    const button = screen.getByRole("button", { name: /criar conta/i });
    fireEvent.click(button);

    await waitFor(() => expect(button).toBeDisabled());
    expect(button).toHaveTextContent("Criando...");
  });
});
