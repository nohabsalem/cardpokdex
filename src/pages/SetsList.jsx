import React, { useEffect, useState } from "react";

/**
 * SetsList Page
 * - Fetches /api/sets
 * - Displays set logos in a grid
 * - Clicking a set navigates to /sets/:setId via history.pushState
 */
export default function SetsList({ navigateTo }) {
  const [sets, setSets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSets = async () => {
      setLoading(true);
      try {
        const resp = await fetch("http://127.0.0.1:5000/api/sets");
        if (!resp.ok) throw new Error(`Erreur HTTP ${resp.status}`);
        const data = await resp.json();
        setSets(data || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Erreur lors du chargement des sets");
      } finally {
        setLoading(false);
      }
    };
    loadSets();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Ensembles disponibles</h1>
        <p className="text-sm text-gray-600">
          Clique sur un set pour voir toutes ses cartes.
        </p>
      </div>

      {loading && <p>Chargement des sets...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {sets.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              // navigate to /sets/:id
              const path = `/sets/${s.id}`;
              if (typeof navigateTo === "function") navigateTo(path);
            }}
            className="bg-white rounded-lg p-4 flex flex-col items-center hover:shadow-md transition"
            aria-label={`Voir le set ${s.name}`}
          >
            <img
              src={s.logo}
              alt={`${s.name} logo`}
              className="max-h-28 object-contain mb-3 cursor-pointer"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/200x80?text=Logo+indisponible";
              }}
            />
            <div className="text-center">
              <div className="font-semibold text-gray-800">{s.name}</div>
              <div className="text-xs text-gray-500">{s.series}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
