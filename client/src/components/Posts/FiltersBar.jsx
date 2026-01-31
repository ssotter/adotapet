import { useEffect, useState } from "react";

function ToggleBtn({ active, onClick, disabled, children, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "flex-1 px-3 py-2 rounded-xl border text-sm font-semibold transition",
        active
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
        disabled ? "opacity-60 hover:bg-white" : "",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function FiltersBar({
  neighborhoods,
  filters,
  setFilters,
  onSearch,
  onClear,
  loading = false,
  embedded = false,
}) {
  const [pendingAction, setPendingAction] = useState(null); // "search" | "clear" | null

  function setField(key, value) {
    setFilters((f) => ({ ...f, [key]: value }));
  }

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

  // ✅ MOBILE / MODAL: layout igual ao print (seções + divisores)
  if (embedded) {
    const ageMax = Number(filters.ageMax ?? 24);
    const safeAgeMax = Number.isFinite(ageMax) ? ageMax : 24;

    const setTypeToggle = (value) => {
      // se clicar no ativo, desmarca (volta p/ "todos" sem mostrar botão "Todos")
      setField("type", filters.type === value ? "" : value);
    };

    const setSpeciesToggle = (value) => {
      setField("species", filters.species === value ? "" : value);
    };

    const setSizeToggle = (value) => {
      setField("size", filters.size === value ? "" : value);
    };

    return (
      <div className="space-y-4">
        {/* Espécie */}
        <div>
          <div className="text-sm font-semibold text-gray-800 mb-2">Espécie</div>
          <div className="flex gap-2">
            <ToggleBtn
              active={filters.species === "DOG"}
              disabled={loading}
              onClick={() => setSpeciesToggle("DOG")}
            >
              🐶 Cachorro
            </ToggleBtn>

            <ToggleBtn
              active={filters.species === "CAT"}
              disabled={loading}
              onClick={() => setSpeciesToggle("CAT")}
            >
              🐱 Gato
            </ToggleBtn>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Tipo */}
        <div>
          <div className="text-sm font-semibold text-gray-800 mb-2">Tipo</div>
          <div className="flex gap-2">
            <ToggleBtn
              active={filters.type === "ADOPTION"}
              disabled={loading}
              onClick={() => setTypeToggle("ADOPTION")}
            >
              Adoção
            </ToggleBtn>

            <ToggleBtn
              active={filters.type === "FOUND_LOST"}
              disabled={loading}
              onClick={() => setTypeToggle("FOUND_LOST")}
            >
              Perdido
            </ToggleBtn>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Idade (slider) */}
        <div>
          <div className="flex items-end justify-between mb-2">
            <div className="text-sm font-semibold text-gray-800">
              Idade (meses)
            </div>
            <div className="text-xs text-gray-500">
              0 – <span className="font-semibold text-gray-700">{safeAgeMax}</span>
            </div>
          </div>

          <input
            type="range"
            min={0}
            max={24}
            step={1}
            value={safeAgeMax}
            disabled={loading}
            onChange={(e) => setField("ageMax", e.target.value)}
            className="w-full"
          />
        </div>

        <hr className="border-gray-200" />

        {/* Porte */}
        <div>
          <div className="text-sm font-semibold text-gray-800 mb-2">Porte</div>
          <div className="flex gap-2">
            <ToggleBtn
              active={filters.size === "SMALL"}
              disabled={loading}
              onClick={() => setSizeToggle("SMALL")}
              className="justify-center"
            >
              P
            </ToggleBtn>

            <ToggleBtn
              active={filters.size === "MEDIUM"}
              disabled={loading}
              onClick={() => setSizeToggle("MEDIUM")}
              className="justify-center"
            >
              M
            </ToggleBtn>

            <ToggleBtn
              active={filters.size === "LARGE"}
              disabled={loading}
              onClick={() => setSizeToggle("LARGE")}
              className="justify-center"
            >
              G
            </ToggleBtn>
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* ✅ Bairro (inserido) */}
        <div>
          <div className="text-sm font-semibold text-gray-800 mb-2">Bairro</div>
          <select
            className="w-full border rounded-xl px-3 py-2 disabled:bg-gray-50 disabled:text-gray-400"
            value={filters.neighborhoodId}
            onChange={(e) => setField("neighborhoodId", e.target.value)}
            disabled={loading}
          >
            <option value="">Todos os bairros</option>
            {neighborhoods.map((n) => (
              <option key={n.id} value={n.id}>
                {n.name}
              </option>
            ))}
          </select>
        </div>

        {/* Rodapé (sticky) */}
        <div className="sticky bottom-0 bg-white pt-3 pb-1">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleClear}
              disabled={loading}
              className="px-4 py-3 rounded-2xl border bg-white hover:bg-gray-50 text-sm font-semibold disabled:opacity-60"
            >
              {loading && pendingAction === "clear" ? "Limpando..." : "Limpar"}
            </button>

            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-4 py-3 rounded-2xl bg-[#E58E5E] text-white text-sm font-semibold disabled:opacity-60"
            >
              {loading && pendingAction === "search"
                ? "Aplicando..."
                : "Aplicar filtros"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // (Se algum dia voltar a usar inline fora do modal, pode manter o layout antigo)
  return (
    <div className="p-4 rounded-2xl border bg-white">
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {/* seu layout antigo pode ficar aqui se quiser */}
        <div className="text-sm text-gray-600">
          (Layout inline não usado atualmente)
        </div>
      </div>
    </div>
  );
}
