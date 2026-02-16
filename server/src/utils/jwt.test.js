import { beforeEach, describe, expect, it } from "vitest";
import { generateToken, verifyToken } from "./jwt.js";

describe("jwt helpers", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret";
    process.env.JWT_EXPIRES_IN = "1h";
  });

  it("gera e valida tokens com o mesmo segredo", () => {
    const payload = { sub: "user-123", role: "ADMIN" };

    const token = generateToken(payload);
    const decoded = verifyToken(token);

    expect(typeof token).toBe("string");
    expect(decoded.sub).toBe(payload.sub);
    expect(decoded.role).toBe(payload.role);
  });

  it("dispara erro quando o segredo nao confere", () => {
    const payload = { sub: "user-456" };
    const token = generateToken(payload);

    process.env.JWT_SECRET = "outro-segredo";

    expect(() => verifyToken(token)).toThrow();
  });
});
