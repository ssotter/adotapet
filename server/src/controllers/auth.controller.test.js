import { beforeEach, describe, expect, it, vi } from "vitest";
import crypto from "crypto";

const poolMock = vi.hoisted(() => ({ query: vi.fn() }));
vi.mock("../db/connection.js", () => ({
  pool: poolMock
}));
const poolQueryMock = poolMock.query;

const bcryptMock = vi.hoisted(() => ({
  hash: vi.fn(),
  compare: vi.fn()
}));
vi.mock("bcrypt", () => ({
  default: bcryptMock
}));
const bcryptHashMock = bcryptMock.hash;
const bcryptCompareMock = bcryptMock.compare;

const generateTokenMock = vi.hoisted(() => vi.fn());
vi.mock("../utils/jwt.js", () => ({
  generateToken: generateTokenMock
}));

const sendResetPasswordEmailMock = vi.hoisted(() => vi.fn());
vi.mock("../utils/email.js", () => ({
  sendResetPasswordEmail: sendResetPasswordEmailMock
}));

import { register, login, forgotPassword } from "./auth.controller.js";

function createRes() {
  return {
    statusCode: 200,
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

describe("auth controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    poolQueryMock.mockReset();
    bcryptHashMock.mockReset();
    bcryptCompareMock.mockReset();
    generateTokenMock.mockReset();
    sendResetPasswordEmailMock.mockReset();
  });

  describe("register", () => {
    it("retorna 409 quando email já existe", async () => {
      poolQueryMock.mockResolvedValueOnce({ rows: [{ id: "u1" }] });
      const res = createRes();

      await register(
        { body: { name: "Ana", email: "ana@x.com", password: "123456", whatsapp: "41" } },
        res
      );

      expect(res.statusCode).toBe(409);
      expect(res.payload).toEqual({ error: "E-mail já cadastrado" });
      expect(poolQueryMock).toHaveBeenCalledTimes(1);
    });

    it("cria usuário novo e retorna token", async () => {
      poolQueryMock
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({
          rows: [
            {
              id: "u2",
              name: "Ana",
              email: "ana@x.com",
              whatsapp: "41",
              avatar_url: null
            }
          ]
        });
      bcryptHashMock.mockResolvedValue("hashed");
      generateTokenMock.mockReturnValue("jwt-token");
      const res = createRes();

      await register(
        { body: { name: "Ana", email: "ana@x.com", password: "123456", whatsapp: "41" } },
        res
      );

      expect(poolQueryMock).toHaveBeenCalledTimes(2);
      expect(bcryptHashMock).toHaveBeenCalledWith("123456", 10);
      expect(generateTokenMock).toHaveBeenCalledWith({ id: "u2", email: "ana@x.com" });
      expect(res.statusCode).toBe(201);
      expect(res.payload).toEqual({
        user: {
          id: "u2",
          name: "Ana",
          email: "ana@x.com",
          whatsapp: "41",
          avatar_url: null
        },
        token: "jwt-token"
      });
    });
  });

  describe("login", () => {
    it("falha quando usuário não existe", async () => {
      poolQueryMock.mockResolvedValueOnce({ rows: [] });
      const res = createRes();

      await login({ body: { email: "a@a", password: "123" } }, res);

      expect(res.statusCode).toBe(401);
      expect(res.payload).toEqual({ error: "Usuário ou senha inválidos" });
    });

    it("retorna token quando credenciais corretas", async () => {
      poolQueryMock.mockResolvedValueOnce({
        rows: [
          {
            id: "u3",
            name: "Bruno",
            email: "b@b",
            whatsapp: "4999",
            avatar_url: "http://avatar",
            password_hash: "hashed"
          }
        ]
      });
      bcryptCompareMock.mockResolvedValue(true);
      generateTokenMock.mockReturnValue("token-123");
      const res = createRes();

      await login({ body: { email: "b@b", password: "secret" } }, res);

      expect(bcryptCompareMock).toHaveBeenCalledWith("secret", "hashed");
      expect(generateTokenMock).toHaveBeenCalledWith({ id: "u3", email: "b@b" });
      expect(res.statusCode).toBe(200);
      expect(res.payload).toEqual({
        user: {
          id: "u3",
          name: "Bruno",
          email: "b@b",
          whatsapp: "4999",
          avatar_url: "http://avatar"
        },
        token: "token-123"
      });
    });
  });

  describe("forgotPassword", () => {
    it("sempre retorna mensagem neutra quando email não existe", async () => {
      poolQueryMock.mockResolvedValueOnce({ rows: [] });
      const res = createRes();

      await forgotPassword({ body: { email: "ghost@example.com" } }, res);

      expect(res.statusCode).toBe(200);
      expect(res.payload).toEqual({
        data: {
          message:
            "Se este e-mail estiver cadastrado, enviaremos instruções para redefinir sua senha."
        }
      });
      expect(sendResetPasswordEmailMock).not.toHaveBeenCalled();
    });

    it("gera token e envia e-mail quando usuario existe", async () => {
      poolQueryMock
        .mockResolvedValueOnce({ rows: [{ id: "u4", name: "Lia", email: "lia@example.com" }] })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({ rows: [] });

      const res = createRes();

      const hashSpy = vi.spyOn(crypto, "createHash");

      await forgotPassword({ body: { email: "lia@example.com" } }, res);

      expect(poolQueryMock).toHaveBeenCalledTimes(3);
      expect(hashSpy).toHaveBeenCalledWith("sha256");
      expect(sendResetPasswordEmailMock).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "lia@example.com",
          name: "Lia",
          resetUrl: expect.stringContaining("/reset-password?token=")
        })
      );
      expect(res.payload.data.message).toMatch(/Se este e-mail estiver cadastrado/i);
      hashSpy.mockRestore();
    });
  });
});
