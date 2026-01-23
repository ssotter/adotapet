import { api } from "./client";

// dono do anúncio vê solicitações recebidas
export async function listReceivedRequests() {
  const { data } = await api.get("/my/received-visit-requests");
  return data;
}

// interessado vê suas próprias solicitações (guardado para depois)
export async function listMyRequests() {
  const { data } = await api.get("/my/visit-requests");
  return data;
}

// dono aprova ou rejeita
export async function updateVisitRequest(id, status) {
  const { data } = await api.patch(`/visit-requests/${id}`, { status });
  return data;
}
