import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Logo from "./Logo.jsx";

describe("Logo", () => {
  it("mostra nome da aplicacao", () => {
    render(<Logo />);

    expect(screen.getByText(/Adota/i)).toBeInTheDocument();
    expect(screen.getByText(/Pet/i)).toBeInTheDocument();
  });

  it("exibe subtitulo opcional", () => {
    render(<Logo subtitle="Curitiba" />);

    expect(screen.getByText("Curitiba")).toBeInTheDocument();
  });
});
