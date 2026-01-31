import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../store/auth";
import { favoritePost, unfavoritePost } from "../../api/posts";

function badgeLabel(type) {
  return type === "FOUND_LOST" ? "Encontrado/Perdido" : "Adoção";
}

function statusLabel(status) {
  return status === "ACTIVE" ? "Ativo" : "Encerrado";
}

function speciesLabel(v) {
  if (v === "DOG") return "Cachorro";
  if (v === "CAT") return "Gato";
  return v || "—";
}

export default function PostCard({ post, onUnfavorite }) {
  const { user } = useAuth();
  const location = useLocation();

  const cover = post.cover_url;
  const title =
    post.name ||
    (post.type === "FOUND_LOST" ? "Animal encontrado" : "Pet para adoção");

  const initialFav = useMemo(() => Boolean(post.is_favorited), [post.is_favorited]);
  const [isFav, setIsFav] = useState(initialFav);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setIsFav(Boolean(post.is_favorited));
  }, [post.is_favorited]);

  async function toggleFavorite(e) {
    e.preventDefault(); // não navegar
    e.stopPropagation();

    if (!user || saving) return;

    const next = !isFav;
    setIsFav(next); // otimista
    setSaving(true);

    try {
      if (next) {
        await favoritePost(post.id);
      } else {
        await unfavoritePost(post.id);
        if (typeof onUnfavorite === "function") onUnfavorite(post.id);
      }
    } catch {
      // rollback se falhar
      setIsFav(!next);
    } finally {
      setSaving(false);
    }
  }

  const from = `${location.pathname}${location.search}`;

  return (
    <Link
      to={`/posts/${post.id}`}
      state={{ from }}
      className="group rounded-2xl border bg-white overflow-hidden hover:shadow-sm transition relative"
    >
      {/* ❤️ (só aparece logado) */}
      {user ? (
        <button
          type="button"
          onClick={toggleFavorite}
          disabled={saving}
          aria-label={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          className={`absolute top-3 left-3 z-10 h-10 w-10 rounded-full grid place-items-center
            backdrop-blur border transition
            ${isFav ? "bg-red-50 border-red-200" : "bg-white/80 border-gray-200"}
            ${saving ? "opacity-60" : "opacity-100 hover:scale-[1.02]"}
          `}
          title={isFav ? "Favoritado" : "Favoritar"}
        >
          <span className={`${isFav ? "text-red-600" : "text-gray-600"} text-lg leading-none`}>
            {isFav ? "❤️" : "🤍"}
          </span>
        </button>
      ) : null}

      <div className="h-44 bg-gray-100 flex items-center justify-center overflow-hidden">
        {cover ? (
          <img src={cover} alt={title} className="max-h-full max-w-full object-contain" />
        ) : (
          <div className="w-full h-full grid place-items-center text-gray-400 text-sm">
            Sem foto
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-semibold leading-tight">{title}</div>

            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-500">Bairro:</span>{" "}
              {post.neighborhood || "—"}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            {post.status ? (
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium
                  ${
                    post.status === "ACTIVE"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }
                `}
              >
                {statusLabel(post.status)}
              </span>
            ) : null}

            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
              {badgeLabel(post.type)}
            </span>
          </div>
        </div>

        <div className="mt-3 text-sm text-gray-700 grid grid-cols-2 gap-2">
          <div>
            Idade: <span className="font-medium">{post.age_months}</span>m
          </div>
          <div>
            Peso: <span className="font-medium">{post.weight_kg}</span>kg
          </div>
          <div>
            Cor: <span className="font-medium">{post.color}</span>
          </div>
          <div>
            Espécie: <span className="font-medium">{speciesLabel(post.species)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
