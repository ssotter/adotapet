import { api } from "./client";

export async function changeMyPassword(currentPassword, newPassword) {
  const res = await api.patch("/auth/me/password", {
    currentPassword,
    newPassword,
  });
  return res.data.data;
}

export async function forgotPassword(email) {
  const res = await api.post("/auth/forgot-password", { email });
  return res.data.data;
}

export async function resetPassword(token, newPassword) {
  const res = await api.post("/auth/reset-password", { token, newPassword });
  return res.data.data;
}
