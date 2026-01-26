import { useEffect, useMemo, useState } from "react";
import Container from "../components/Layout/Container";
import FiltersBar from "../components/Posts/FiltersBar";
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

export default function Home() {
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [filters, setFilters] = useState({
    type: "",
    neighborhoodId: "",
    color: "",
    ageMin: "",
    ageMax: "",
    weightMin: "",
    weightMax: "",
  });

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

  async function onSearch() {
    setLoading(true);
    setError(null);
    try {
      const ps = await listPosts(filters);
      setPosts(ps);
    } catch (err) {
      setError(err?.response?.data?.error || "Falha ao buscar posts");
    } finally {
      setLoading(false);
    }
  }

  async function onClear() {
    const cleared = {
      type: "",
      neighborhoodId: "",
      color: "",
      ageMin: "",
      ageMax: "",
      weightMin: "",
      weightMax: "",
    };
    setFilters(cleared);

    setLoading(true);
    setError(null);
    try {
      const ps = await listPosts({});
      setPosts(ps);
    } catch (err) {
      setError(err?.response?.data?.error || "Falha ao buscar posts");
    } finally {
      setLoading(false);
    }
  }

  const sortedPosts = useMemo(() => {
    // ACTIVE primeiro; depois por created_at desc (se existir)
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
          <h1 className="text-2xl font-semibold">Pets disponíveis</h1>
          <p className="text-gray-600 text-sm">
            Filtre por bairro, cor, idade e peso.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <FiltersBar
          neighborhoods={neighborhoods}
          filters={filters}
          setFilters={setFilters}
          onSearch={onSearch}
          onClear={onClear}
          loading={loading}
        />
      </div>

      <div className="mt-6">
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
