import { Link } from "react-router-dom";

function badgeLabel(type) {
  return type === "FOUND_LOST" ? "Encontrado/Perdido" : "Adoção";
}

export default function PostCard({ post }) {
  const cover = post.cover_url; // se você futuramente mandar photos no list, aparece. Por enquanto usaremos placeholder.
  const title =
    post.name ||
    (post.type === "FOUND_LOST" ? "Animal encontrado" : "Pet para adoção");

  return (
    <Link
      to={`/posts/${post.id}`}
      className="group rounded-2xl border bg-white overflow-hidden hover:shadow-sm transition"
    >
      <div className="h-44 bg-gray-100 flex items-center justify-center overflow-hidden">
        {cover ? (
          <img
            src={cover}
            alt={title}
            className="max-h-full max-w-full object-contain"
          />
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
            <div className="text-sm text-gray-600">{post.neighborhood}</div>
          </div>

          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
            {badgeLabel(post.type)}
          </span>
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
            Espécie: <span className="font-medium">{post.species}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
