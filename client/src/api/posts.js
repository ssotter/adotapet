import { api } from "./client";

export async function listPosts(filters = {}) {
  const params = {};

  // só envia se existir
  if (filters.type) params.type = filters.type;
  if (filters.neighborhoodId) params.neighborhoodId = filters.neighborhoodId;
  if (filters.color) params.color = filters.color;

  if (filters.ageMin !== "" && filters.ageMin !== null && filters.ageMin !== undefined)
    params.ageMin = filters.ageMin;
  if (filters.ageMax !== "" && filters.ageMax !== null && filters.ageMax !== undefined)
    params.ageMax = filters.ageMax;

  if (filters.weightMin !== "" && filters.weightMin !== null && filters.weightMin !== undefined)
    params.weightMin = filters.weightMin;
  if (filters.weightMax !== "" && filters.weightMax !== null && filters.weightMax !== undefined)
    params.weightMax = filters.weightMax;

  const { data } = await api.get("/posts", { params });
  return data;
}
