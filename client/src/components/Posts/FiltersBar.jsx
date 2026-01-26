import { useEffect, useState } from "react";

export default function FiltersBar({
  neighborhoods,
  filters,
  setFilters,
  onSearch,
  onClear,
  loading = false,
}) {
  const [pendingAction, setPendingAction] = useState(null); // "search" | "clear" | null

  function setField(key, value) {
    setFilters((f) => ({ ...f, [key]: value }));
  }

  // quando o loading acabar, limpa o estado da ação pendente
  useEffect(() => {
    if (!loading) setPendingAction(null);
  }, [loading]);

  async function handleSearch() {
    if (loading) return;
    setPendingAction("search");
    await onSearch();
  }

  async function handleClear() {
    if (loading) return;
    setPendingAction("clear");
    await onClear();
  }

  return (
    <div className="p-4 rounded-2xl border bg-white">
      {/* 1 + 2 + 2 + 1 + 1 = 7 colunas (tudo em uma linha no md+) */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600">Tipo</label>
          <select
            className="mt-1 w-full border rounded-xl px-3 py-2 disabled:bg-gray-50 disabled:text-gray-400"
            value={filters.type}
            onChange={(e) => setField("type", e.target.value)}
            disabled={loading}
          >
            <option value="">Todos</option>
            <option value="ADOPTION">Adoção</option>
            <option value="FOUND_LOST">Encontrado/Perdido</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-medium text-gray-600">Bairro</label>
          <select
            className="mt-1 w-full border rounded-xl px-3 py-2 disabled:bg-gray-50 disabled:text-gray-400"
            value={filters.neighborhoodId}
            onChange={(e) => setField("neighborhoodId", e.target.value)}
            disabled={loading}
          >
            <option value="">Todos</option>
            {neighborhoods.map((n) => (
              <option key={n.id} value={n.id}>
                {n.name}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-medium text-gray-600">Cor</label>
          <input
            className="mt-1 w-full border rounded-xl px-3 py-2 disabled:bg-gray-50 disabled:text-gray-400"
            value={filters.color}
            onChange={(e) => setField("color", e.target.value)}
            placeholder="ex: caramelo, preto..."
            disabled={loading}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600">
            Idade (meses)
          </label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <input
              className="w-full border rounded-xl px-3 py-2 disabled:bg-gray-50 disabled:text-gray-400"
              value={filters.ageMin}
              onChange={(e) => setField("ageMin", e.target.value)}
              placeholder="min"
              inputMode="numeric"
              disabled={loading}
            />
            <input
              className="w-full border rounded-xl px-3 py-2 disabled:bg-gray-50 disabled:text-gray-400"
              value={filters.ageMax}
              onChange={(e) => setField("ageMax", e.target.value)}
              placeholder="max"
              inputMode="numeric"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-600">Peso (kg)</label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <input
              className="w-full border rounded-xl px-3 py-2 disabled:bg-gray-50 disabled:text-gray-400"
              value={filters.weightMin}
              onChange={(e) => setField("weightMin", e.target.value)}
              placeholder="min"
              inputMode="decimal"
              disabled={loading}
            />
            <input
              className="w-full border rounded-xl px-3 py-2 disabled:bg-gray-50 disabled:text-gray-400"
              value={filters.weightMax}
              onChange={(e) => setField("weightMax", e.target.value)}
              placeholder="max"
              inputMode="decimal"
              disabled={loading}
            />
          </div>
        </div>

        {/* Botões continuam embaixo, mas agora o grid “real” de filtros fica 1 linha no md+ */}
        <div className="md:col-span-7 flex gap-2 justify-end pt-1">
          <button
            onClick={handleClear}
            disabled={loading}
            className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-50 text-sm font-medium disabled:opacity-60 disabled:hover:bg-white"
          >
            {loading && pendingAction === "clear" ? "Limpando..." : "Limpar"}
          </button>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-black text-white text-sm font-medium disabled:opacity-60"
          >
            {loading && pendingAction === "search" ? "Buscando..." : "Buscar"}
          </button>
        </div>
      </div>
    </div>
  );
}
