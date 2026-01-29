import { useEffect, useState } from "react";
import Container from "../components/Layout/Container";
import PostCard from "../components/Posts/PostCard";
import { listFavorites } from "../api/posts";

function pickCoverUrl(post) {
  if (post.cover_url) return post.cover_url;

  const photos = Array.isArray(post.photos) ? post.photos : [];
  if (photos.length === 0) return null;

  if (post.cover_photo_id) {
    const cover = photos.find((p) => p.id === post.cover_photo_id);
    if (cover?.url) return cover.url;
  }

  return photos[0]?.url ?? null;
}

export default function Favorites() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data = await listFavorites();
      const normalized = (data || []).map((p) => ({
        ...p,
        neighborhood: p.neighborhood ?? p.neighborhood_name ?? p.neighborhood,
        cover_url: pickCoverUrl(p),
        is_favorited: true,
      }));
      setPosts(normalized);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function handleUnfavorite(postId) {
    // remove imediatamente da lista
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }

  return (
    <Container>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl font-semibold">Meus favoritos</h1>
        </div>

        {loading ? (
          <div className="mt-6 text-gray-500">Carregando...</div>
        ) : posts.length === 0 ? (
          <div className="mt-6 text-gray-500">
            Você ainda não favoritou nenhum pet.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} onUnfavorite={handleUnfavorite} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
