export default function FiltersBar({ neighborhoods, filters, setFilters, onSearch, onClear }) {
  function setField(key, value) {
    setFilters((f) => ({ ...f, [key]: value }));
  }

  return (
    <div className="p-4 rounded-2xl border bg-white">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600">Tipo</label>
          <select
            className="mt-1 w-full border rounded-xl px-3 py-2"
            value={filters.type}
            onChange={(e) => setField("type", e.target.value)}
          >
            <option value="">Todos</option>
            <option value="ADOPTION">Adoção</option>
            <option value="FOUND_LOST">Encontrado/Perdido</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-medium text-gray-600">Bairro</label>
          <select
            className="mt-1 w-full border rounded-xl px-3 py-2"
            value={filters.neighborhoodId}
            onChange={(e) => setField("neighborhoodId", e.target.value)}
          >
            <option value="">Todos</option>
            {neighborhoods.map((n) => (
              <option key={n.id} value={n.id}>{n.name}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-medium text-gray-600">Cor</label>
          <input
            className="mt-1 w-full border rounded-xl px-3 py-2"
            value={filters.color}
            onChange={(e) => setField("color", e.target.value)}
            placeholder="ex: caramelo, preto..."
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600">Idade (meses)</label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <input
              className="w-full border rounded-xl px-3 py-2"
              value={filters.ageMin}
              onChange={(e) => setField("ageMin", e.target.value)}
              placeholder="min"
              inputMode="numeric"
            />
            <input
              className="w-full border rounded-xl px-3 py-2"
              value={filters.ageMax}
              onChange={(e) => setField("ageMax", e.target.value)}
              placeholder="max"
              inputMode="numeric"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600">Peso (kg)</label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <input
              className="w-full border rounded-xl px-3 py-2"
              value={filters.weightMin}
              onChange={(e) => setField("weightMin", e.target.value)}
              placeholder="min"
              inputMode="decimal"
            />
            <input
              className="w-full border rounded-xl px-3 py-2"
              value={filters.weightMax}
              onChange={(e) => setField("weightMax", e.target.value)}
              placeholder="max"
              inputMode="decimal"
            />
          </div>
        </div>

        <div className="md:col-span-6 flex gap-2 justify-end pt-1">
          <button
            onClick={onClear}
            className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-50 text-sm font-medium"
          >
            Limpar
          </button>
          <button
            onClick={onSearch}
            className="px-4 py-2 rounded-xl bg-black text-white text-sm font-medium"
          >
            Buscar
          </button>
        </div>
      </div>
    </div>
  );
}
