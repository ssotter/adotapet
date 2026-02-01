import { useEffect, useMemo, useState } from "react";
import Container from "../components/Layout/Container";
import FiltersBar from "../components/Posts/FiltersBar";
import FilterSheet from "../components/Posts/FilterSheet";
import PostCard from "../components/Posts/PostCard";
import { getNeighborhoods } from "../api/neighborhoods";
import { listPosts } from "../api/posts";

function PostsGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl border bg-white overflow-hidden animate-pulse"
        >
          <div className="h-44 bg-gray-100" />
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="w-full">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mt-2" />
              </div>
              <div className="h-6 bg-gray-100 rounded-full w-24" />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="h-3 bg-gray-100 rounded w-5/6" />
              <div className="h-3 bg-gray-100 rounded w-4/6" />
              <div className="h-3 bg-gray-100 rounded w-5/6" />
              <div className="h-3 bg-gray-100 rounded w-4/6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function typeLabel(v) {
  if (v === "ADOPTION") return "Adoção";
  if (v === "FOUND_LOST") return "Encontrado/Perdido";
  return "Todos";
}

function speciesLabel(v) {
  if (v === "DOG") return "Cachorro";
  if (v === "CAT") return "Gato";
  return "Todas";
}

function sizeLabel(v) {
  if (v === "SMALL") return "P";
  if (v === "MEDIUM") return "M";
  if (v === "LARGE") return "G";
  return "Todos";
}

const normalize = (v) =>
  String(v ?? "")
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

function matchesSpecies(postSpeciesRaw, wantedRaw) {
  const wanted = normalize(wantedRaw);
  if (!wanted) return true;

  const post = normalize(postSpeciesRaw);

  // aceita variações comuns no backend/banco
  if (wanted === "DOG") {
    return (
      post === "DOG" ||
      post === "CACHORRO" ||
      post === "CAO" ||
      post === "CANINO" ||
      post === "CANINE"
    );
  }

  if (wanted === "CAT") {
    return (
      post === "CAT" ||
      post === "GATO" ||
      post === "FELINO" ||
      post === "FELINE" ||
      post === "CATS" // casos estranhos
    );
  }

  // fallback: comparação direta
  return post === wanted;
}

function matchesSize(postSizeRaw, wantedRaw) {
  const wanted = normalize(wantedRaw);
  if (!wanted) return true;

  const post = normalize(postSizeRaw);

  // aceita variações P/M/G ou SMALL/MEDIUM/LARGE
  if (wanted === "SMALL")
    return post === "SMALL" || post === "P" || post === "PEQUENO";
  if (wanted === "MEDIUM")
    return post === "MEDIUM" || post === "M" || post === "MEDIO";
  if (wanted === "LARGE")
    return post === "LARGE" || post === "G" || post === "GRANDE";

  return post === wanted;
}

export default function Home() {
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [filters, setFilters] = useState({
    species: "",
    type: "",
    size: "",
    neighborhoodId: "",
    color: "",
    ageMin: "",
    ageMax: "24", // slider
    weightMin: "",
    weightMax: "",
  });

  const [filterOpen, setFilterOpen] = useState(false);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadInitial() {
    setLoading(true);
    setError(null);
    try {
      const [nbs, ps] = await Promise.all([getNeighborhoods(), listPosts({})]);
      setNeighborhoods(nbs);
      setPosts(ps);
    } catch (err) {
      setError(err?.response?.data?.error || "Falha ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ busca sem depender do setState + filtra species/size no client
  async function runSearch(nextFilters) {
    setLoading(true);
    setError(null);

    try {
      // backend só recebe o que ele já sabe filtrar
      const serverFilters = { ...(nextFilters || {}) };
      delete serverFilters.species;
      delete serverFilters.size;

      const ps = await listPosts(serverFilters);

      // client-side: species + size
      const filtered = ps.filter((p) => {
        const speciesOk = matchesSpecies(p.species, nextFilters?.species);
        const sizeOk = matchesSize(p.size, nextFilters?.size);
        return speciesOk && sizeOk;
      });

      setPosts(filtered);
    } catch (err) {
      setError(err?.response?.data?.error || "Falha ao buscar posts");
    } finally {
      setLoading(false);
    }
  }

  async function onSearch() {
    await runSearch(filters);
  }

  async function onClear() {
    const cleared = {
      species: "",
      type: "",
      size: "",
      neighborhoodId: "",
      color: "",
      ageMin: "",
      ageMax: "24",
      weightMin: "",
      weightMax: "",
    };

    setFilters(cleared);
    await runSearch({});
  }

  async function onSearchAndClose() {
    await onSearch();
    setFilterOpen(false);
  }

  async function onClearAndClose() {
    await onClear();
    setFilterOpen(false);
  }

  const neighborhoodNameById = useMemo(() => {
    const map = new Map();
    for (const n of neighborhoods) map.set(String(n.id), n.name);
    return map;
  }, [neighborhoods]);

  const activeFiltersCount = useMemo(() => {
    let c = 0;

    if (filters.species) c++;
    if (filters.type) c++;
    if (filters.size) c++;
    if (filters.neighborhoodId) c++;
    if (filters.color) c++;

    if (filters.ageMin !== "" && filters.ageMin != null) c++;
    // ageMax só conta se fugir do default 24
    if (String(filters.ageMax ?? "24") !== "24") c++;

    if (filters.weightMin !== "" && filters.weightMin != null) c++;
    if (filters.weightMax !== "" && filters.weightMax != null) c++;

    return c;
  }, [filters]);

  const chips = useMemo(() => {
    const list = [];

    if (filters.species) {
      list.push({
        key: "species",
        label: `Espécie: ${speciesLabel(filters.species)}`,
        clear: (f) => ({ ...f, species: "" }),
      });
    }

    if (filters.type) {
      list.push({
        key: "type",
        label: `Tipo: ${typeLabel(filters.type)}`,
        clear: (f) => ({ ...f, type: "" }),
      });
    }

    if (filters.size) {
      list.push({
        key: "size",
        label: `Porte: ${sizeLabel(filters.size)}`,
        clear: (f) => ({ ...f, size: "" }),
      });
    }

    if (filters.neighborhoodId) {
      const name =
        neighborhoodNameById.get(String(filters.neighborhoodId)) || "—";
      list.push({
        key: "neighborhoodId",
        label: `Bairro: ${name}`,
        clear: (f) => ({ ...f, neighborhoodId: "" }),
      });
    }

    if (filters.color) {
      list.push({
        key: "color",
        label: `Cor: ${filters.color}`,
        clear: (f) => ({ ...f, color: "" }),
      });
    }

    const ageMinHas = filters.ageMin !== "" && filters.ageMin != null;
    const ageMaxHas =
      filters.ageMax !== "" &&
      filters.ageMax != null &&
      String(filters.ageMax ?? "24") !== "24"; // só mostra chip se não for default

    if (ageMinHas || ageMaxHas) {
      const txt =
        ageMinHas && ageMaxHas
          ? `${filters.ageMin}–${filters.ageMax}m`
          : ageMinHas
            ? `≥ ${filters.ageMin}m`
            : `≤ ${filters.ageMax}m`;

      list.push({
        key: "ageRange",
        label: `Idade: ${txt}`,
        clear: (f) => ({ ...f, ageMin: "", ageMax: "24" }),
      });
    }

    const wMinHas = filters.weightMin !== "" && filters.weightMin != null;
    const wMaxHas = filters.weightMax !== "" && filters.weightMax != null;

    if (wMinHas || wMaxHas) {
      const txt =
        wMinHas && wMaxHas
          ? `${filters.weightMin}–${filters.weightMax}kg`
          : wMinHas
            ? `≥ ${filters.weightMin}kg`
            : `≤ ${filters.weightMax}kg`;

      list.push({
        key: "weightRange",
        label: `Peso: ${txt}`,
        clear: (f) => ({ ...f, weightMin: "", weightMax: "" }),
      });
    }

    return list;
  }, [filters, neighborhoodNameById]);

  async function removeChip(chip) {
    const next = chip.clear(filters);
    setFilters(next);
    await runSearch(next);
  }

  async function clearAllChips() {
    await onClear();
  }

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      const aActive = a.status === "ACTIVE";
      const bActive = b.status === "ACTIVE";
      if (aActive !== bActive) return aActive ? -1 : 1;

      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bTime - aTime;
    });
  }, [posts]);

  return (
    <Container>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-gray-600 text-sm max-w-xl">
            Plataforma digital para adoção responsável de pets em Rio Grande/RS.
          </p>
        </div>

        {/* Botão Filtrar (desktop) */}
        <div className="hidden sm:flex items-center gap-2">
          {activeFiltersCount > 0 ? (
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
              {activeFiltersCount} filtro(s)
            </span>
          ) : null}

          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-50 text-sm font-medium"
          >
            🔍 Filtrar
          </button>
        </div>
      </div>

      {/* Chips */}
      {chips.length > 0 ? (
        <div className="mt-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {chips.map((c) => (
              <div
                key={c.key}
                className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full border bg-white text-sm"
              >
                <span className="text-gray-800">{c.label}</span>
                <button
                  type="button"
                  onClick={() => removeChip(c)}
                  disabled={loading}
                  className="h-6 w-6 rounded-full border bg-white hover:bg-gray-50 grid place-items-center disabled:opacity-60"
                  aria-label={`Remover filtro: ${c.label}`}
                  title="Remover"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={clearAllChips}
              disabled={loading}
              className="shrink-0 px-3 py-1.5 rounded-full border bg-white hover:bg-gray-50 text-sm font-medium disabled:opacity-60"
            >
              Limpar tudo
            </button>
          </div>
        </div>
      ) : null}

      {/* Barra fixa mobile */}
      <div className="sm:hidden fixed left-0 right-0 bottom-0 z-40">
        <div className="px-4 pb-4 pt-3 bg-white/85 backdrop-blur border-t">
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="w-full px-4 py-3 rounded-2xl bg-black text-white font-medium flex items-center justify-center gap-2"
          >
            <span>🔍</span>
            <span>Filtrar</span>
            {activeFiltersCount > 0 ? (
              <span className="ml-1 text-xs px-2 py-1 rounded-full bg-white/20 border border-white/30">
                {activeFiltersCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      {/* Sheet/Modal */}
      <FilterSheet
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        title="Filtros"
      >
        <FiltersBar
          embedded
          neighborhoods={neighborhoods}
          filters={filters}
          setFilters={setFilters}
          onSearch={onSearchAndClose}
          onClear={onClearAndClose}
          loading={loading}
        />
      </FilterSheet>

      <div className="mt-6 pb-14 sm:pb-0">
        {error && (
          <div className="p-4 rounded-2xl border bg-white text-sm text-red-600">
            {String(error)}
          </div>
        )}

        {loading ? (
          <PostsGridSkeleton count={6} />
        ) : posts.length === 0 ? (
          <div className="p-4 rounded-2xl border bg-white text-sm text-gray-500">
            Nenhum anúncio encontrado com esses filtros.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedPosts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
