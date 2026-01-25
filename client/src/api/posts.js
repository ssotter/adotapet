import { api } from "./client";

export async function listPosts(filters = {}) {
  const params = {};

  // só envia se existir
  if (filters.type) params.type = filters.type;
  if (filters.neighborhoodId) params.neighborhoodId = filters.neighborhoodId;
  if (filters.color) params.color = filters.color;

  if (
    filters.ageMin !== "" &&
    filters.ageMin !== null &&
    filters.ageMin !== undefined
  )
    params.ageMin = filters.ageMin;
  if (
    filters.ageMax !== "" &&
    filters.ageMax !== null &&
    filters.ageMax !== undefined
  )
    params.ageMax = filters.ageMax;

  if (
    filters.weightMin !== "" &&
    filters.weightMin !== null &&
    filters.weightMin !== undefined
  )
    params.weightMin = filters.weightMin;
  if (
    filters.weightMax !== "" &&
    filters.weightMax !== null &&
    filters.weightMax !== undefined
  )
    params.weightMax = filters.weightMax;

  const res = await api.get("/posts", { params });
  return res.data.data;
}

export async function getPostById(id) {
  const res = await api.get(`/posts/${id}`);
  return res.data.data;
}

export async function requestVisit(postId, message) {
  const { data } = await api.post(`/posts/${postId}/visit-requests`, {
    message,
  });
  return data;
}

export async function getPostContact(postId) {
  const res = await api.get(`/posts/${postId}/contact`);
  return res.data.data;
}

export async function createPost(payload) {
  const res = await api.post("/posts", payload);
  // por enquanto tolerante: se backend ainda não estiver com { data } no POST, não quebra
  return res.data.data ?? res.data;
}
