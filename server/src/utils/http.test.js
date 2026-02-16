import { describe, expect, it } from "vitest";
import { fail, ok } from "./http.js";

function createResponseDouble() {
  return {
    statusCode: null,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.payload = body;
      return body;
    }
  };
}

describe("http helpers", () => {
  it("envolve resposta de sucesso com status padrao", () => {
    const res = createResponseDouble();
    const data = { hello: "world" };

    ok(res, data);

    expect(res.statusCode).toBe(200);
    expect(res.payload).toEqual({ data });
  });

  it("permite sobrescrever status de sucesso", () => {
    const res = createResponseDouble();

    ok(res, { created: true }, 201);

    expect(res.statusCode).toBe(201);
  });

  it("envia erros com estrutura consistente", () => {
    const res = createResponseDouble();

    fail(res, "Nao encontrado", 404, "NOT_FOUND");

    expect(res.statusCode).toBe(404);
    expect(res.payload).toEqual({
      error: { message: "Nao encontrado", code: "NOT_FOUND" }
    });
  });
});
