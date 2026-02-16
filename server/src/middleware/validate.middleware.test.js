import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { validate } from "./validate.middleware.js";

function createResponseDouble() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return payload;
    }
  };
}

describe("validate middleware", () => {
  const schema = z.object({ name: z.string().min(1), age: z.number().int() });

  it("segue para proxima funcao quando payload valido", () => {
    const req = { body: { name: "Luna", age: 3 } };
    const res = createResponseDouble();
    const next = vi.fn();
    const middleware = validate(schema);

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBeNull();
  });

  it("retorna 400 quando schema falha", () => {
    const req = { body: { name: "", age: -1 } };
    const res = createResponseDouble();
    const next = vi.fn();
    const middleware = validate(schema);

    middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: expect.any(Array)
    });
    expect(res.body.error.length).toBeGreaterThan(0);
  });
});
