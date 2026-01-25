import { api } from "./client";

function unwrap(res) {
  return res?.data?.data;
}

export async function createVisitRequest(postId, message) {
  const res = await api.post(`/posts/${postId}/visit-requests`, { message });
  return unwrap(res);
}

export async function listMyVisitRequests() {
  const res = await api.get("/my/visit-requests");
  return unwrap(res);
}

export async function listReceivedVisitRequests() {
  const res = await api.get("/my/received-visit-requests");
  return unwrap(res);
}

export async function updateVisitRequestStatus(id, status) {
  const res = await api.patch(`/visit-requests/${id}`, { status });
  return unwrap(res);
}

/**
 * ✅ Compatibilidade:
 * Se algum componente antigo ainda importar listReceivedRequests,
 * mantém o alias sem quebrar o app.
 */
export const listReceivedRequests = listReceivedVisitRequests;
export const updateVisitRequest = updateVisitRequestStatus;
