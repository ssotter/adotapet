import { useEffect, useMemo, useState } from "react";

export default function PhotoCarousel({ photos = [], title = "Foto do pet" }) {
  const safePhotos = useMemo(
    () => (Array.isArray(photos) ? photos : []),
    [photos]
  );

  const [index, setIndex] = useState(0);

  // ✅ quando a lista de fotos mudar, reseta para primeira (capa)
  useEffect(() => {
    setIndex(0);
  }, [safePhotos]);

  if (!safePhotos.length) {
    return (
      <div className="h-72 rounded-2xl bg-gray-100 grid place-items-center text-gray-400">
        Sem fotos
      </div>
    );
  }

  const current = safePhotos[Math.min(index, safePhotos.length - 1)];

  return (
    <div className="space-y-3">
      <div className="h-72 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
        <img
          src={current.url}
          alt={title}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {safePhotos.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setIndex(i)}
            className={`h-16 w-24 rounded-xl overflow-hidden border flex-shrink-0 ${
              i === index ? "border-black" : "border-gray-200"
            }`}
            title={`Foto ${i + 1}`}
            type="button"
          >
            <img
              src={p.url}
              alt={`thumb ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
