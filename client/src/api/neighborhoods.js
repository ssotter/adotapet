import { api } from "./client";

export async function getNeighborhoods() {
  const { data } = await api.get("/neighborhoods");
  return data; // [{id, name}]
}
