import { describe, expect, it } from "vitest";
import { createPetPostSchema } from "./pet-posts.validators.js";

const validPayload = {
  type: "ADOPTION",
  species: "DOG",
  name: "Bolt",
  color: "Marrom",
  ageMonths: 12,
  weightKg: 8,
  sex: "M",
  size: "SMALL",
  neighborhoodId: "123e4567-e89b-12d3-a456-426614174000",
  description: "Cachorro muito amigavel buscando nova familia",
  eventDate: "2024-12-25"
};

describe("createPetPostSchema", () => {
  it("aceita payload completo valido", () => {
    const result = createPetPostSchema.parse(validPayload);

    expect(result).toMatchObject({
      type: "ADOPTION",
      species: "DOG",
      name: "Bolt"
    });
  });

  it("permite campos opcionais vazios e aplica defaults", () => {
    const result = createPetPostSchema.parse({
      ...validPayload,
      name: "",
      sex: undefined,
      size: undefined
    });

    expect(result.name).toBe("");
    expect(result.sex).toBe("UNKNOWN");
    expect(result.size).toBeUndefined();
  });

  it("falha quando valores fogem das regras", () => {
    const invalidPayload = { ...validPayload, type: "RESCUE", description: "curto" };

    expect(() => createPetPostSchema.parse(invalidPayload)).toThrow();
  });
});
