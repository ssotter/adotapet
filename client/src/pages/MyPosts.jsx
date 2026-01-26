import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listMyPosts } from "../api/posts";

function statusLabel(status) {
  if (status === "ACTIVE") return "Ativo";
  if (status === "RESOLVED") return "Encerrado";
  return status || "";
}

function MyPostsSkeleton({ count = 6 }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-xl border bg-white overflow-hidden"
          aria-hidden="true"
        >
          <div className="h-40 bg-gray-100" />
          <div className="p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="h-4 bg-gray-100 rounded w-40" />
              <div className="h-6 bg-gray-100 rounded-full w-20" />
            </div>
            <div className="h-3 bg-gray-100 rounded w-48 mt-3" />
            <div className="h-3 bg-gray-100 rounded w-full mt-3" />
            <div className="h-3 bg-gray-100 rounded w-10/12 mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MyPosts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await listMyPosts();
        setItems(data || []);
      } catch (e) {
        setError("Não foi possível carregar seus anúncios.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const aActive = a.status === "ACTIVE";
      const bActive = b.status === "ACTIVE";
      if (aActive !== bActive) return aActive ? -1 : 1;

      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bTime - aTime;
    });
  }, [items]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h1 className="text-2xl font-semibold">Meus anúncios</h1>

        <Link
          to="/posts/new"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          + Cadastrar pet
        </Link>
      </div>

      {error && (
        <div className="mb-3 p-3 rounded bg-red-100 text-red-800">{error}</div>
      )}

      {loading ? (
        <MyPostsSkeleton count={6} />
      ) : items.length === 0 ? (
        <div className="p-6 rounded-xl border bg-white">
          <p className="text-gray-700">Você ainda não criou nenhum anúncio.</p>
          <Link
            to="/posts/new"
            className="inline-block mt-3 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Criar meu primeiro anúncio
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedItems.map((p) => (
            <Link
              key={p.id}
              to={`/posts/${p.id}`}
              className="rounded-xl border bg-white overflow-hidden hover:shadow-sm transition"
            >
              <div className="h-40 bg-gray-100">
                {p.cover_url ? (
                  <img
                    src={p.cover_url}
                    alt={p.name || "Pet"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center text-gray-500">
                    Sem foto
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-semibold truncate">
                    {p.name || "Sem nome"}
                  </h2>

                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      p.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {statusLabel(p.status)}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-1">
                  {p.neighborhood} •{" "}
                  {p.type === "ADOPTION" ? "Adoção" : "Encontrado/Perdido"}
                </p>

                {p.description && (
                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                    {p.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
