import { api } from "./client";

export async function uploadMyAvatar(file) {
  const form = new FormData();
  form.append("avatar", file); // field name precisa ser "avatar"

  const { data } = await api.post("/users/me/avatar", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data; // { id, name, email, whatsapp, avatar_url }
}
