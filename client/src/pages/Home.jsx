import { useEffect, useState } from "react";
import Container from "../components/Layout/Container";
import FiltersBar from "../components/Posts/FiltersBar";
import PostCard from "../components/Posts/PostCard";
import { getNeighborhoods } from "../api/neighborhoods";
import { listPosts } from "../api/posts";

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
        />
      </div>

      <div className="mt-6">
        {error && (
          <div className="p-4 rounded-2xl border bg-white text-sm text-red-600">
            {String(error)}
          </div>
        )}

        {loading ? (
          <div className="p-4 rounded-2xl border bg-white text-sm text-gray-500">
            Carregando...
          </div>
        ) : posts.length === 0 ? (
          <div className="p-4 rounded-2xl border bg-white text-sm text-gray-500">
            Nenhum anúncio encontrado com esses filtros.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
