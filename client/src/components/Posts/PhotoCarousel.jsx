import { useState } from "react";

export default function PhotoCarousel({ photos = [], title = "Foto do pet" }) {
  const [index, setIndex] = useState(0);

  if (!photos.length) {
    return (
      <div className="h-72 rounded-2xl bg-gray-100 grid place-items-center text-gray-400">
        Sem fotos
      </div>
    );
  }

  const current = photos[index];

  return (
    <div className="space-y-3">
      <div className="h-72 rounded-2xl overflow-hidden bg-gray-100">
        <img
          src={current.url}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {photos.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setIndex(i)}
            className={`h-16 w-24 rounded-xl overflow-hidden border flex-shrink-0 ${
              i === index ? "border-black" : "border-gray-200"
            }`}
            title={`Foto ${i + 1}`}
          >
            <img src={p.url} alt={`thumb ${i + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
