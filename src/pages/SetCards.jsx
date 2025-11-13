import React, { useState, useEffect } from "react";
import ImageModal from "../components/ImageModal";

/**
 * SetCards Page
 * Affiche toutes les cartes d'un set donné dans une grille à 5 colonnes (responsive)
 * Comportement:
 * - Saisie d'un `setId` (ex: rsv10pt5) puis clique sur "Charger" pour afficher
 * - Récupère toutes les cartes via /api/cards puis filtre côté client
 */
export default function SetCards({
  initialSetId = "rsv10pt5",
  setId: propSetId,
  navigateTo,
}) {
  const [setId, setSetId] = useState(propSetId || initialSetId);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedAlt, setSelectedAlt] = useState("");
  const [setName, setSetName] = useState("");
  const API = "http://127.0.0.1:5000/api";

  // Reload when the prop changes (router navigation) or when setId state changes
  useEffect(() => {
    // If parent passes a setId prop, keep state in sync
    if (propSetId && propSetId !== setId) {
      setSetId(propSetId);
    }
    loadCards();
    fetchSetInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propSetId, setId]);

  const fetchSetInfo = async () => {
    if (!setId) {
      setSetName("");
      return;
    }
    try {
      const resp = await fetch(`${API}/set/${setId}`);
      if (!resp.ok) {
        setSetName(setId);
        return;
      }
      const data = await resp.json();
      setSetName(data.name || setId);
    } catch (err) {
      console.error(err);
      setSetName(setId);
    }
  };

  const loadCards = async () => {
    if (!setId) return;
    setLoading(true);
    setError(null);

    try {
      const resp = await fetch("http://127.0.0.1:5000/api/cards");
      if (!resp.ok) throw new Error(`Erreur HTTP ${resp.status}`);
      const data = await resp.json();

      // Filtre par set_id
      const filtered = data.filter((c) => c.set_id === setId);

      // Trie par number si présent, sinon par id
      filtered.sort((a, b) => {
        const na = Number(a.number) || 0;
        const nb = Number(b.number) || 0;
        if (na !== nb) return na - nb;
        return a.id.localeCompare(b.id);
      });

      setCards(filtered);
    } catch (err) {
      console.error(err);
      setError(err.message || "Erreur lors du chargement des cartes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <button
            onClick={() =>
              typeof navigateTo === "function"
                ? navigateTo("/sets")
                : (window.location.pathname = "/sets")
            }
            className="text-sm text-gray-600 hover:text-gray-800 mr-4 cursor-pointer"
          >
            ← Retour aux sets
          </button>
          <span className="text-sm text-gray-700">
            {cards.length} carte(s) pour le set{" "}
            <strong>{setName || setId}</strong>
          </span>
        </div>
        <div>
          {loading && <p>Chargement des cartes...</p>}
          {error && <p className="text-red-600">{error}</p>}
        </div>
      </div>

      {/* Grille: 5 colonnes sur large, responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div key={c.id} className="flex justify-center">
            <img
              src={c.small || c.large}
              alt={c.name}
              className="w-full h-auto rounded-lg shadow-sm hover:shadow-md transition-transform hover:scale-105 cursor-pointer"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/240x320?text=Image+indisponible";
              }}
              onClick={() => {
                // open modal with the large image if available
                const large = c.large || c.small;
                setSelectedImage(large);
                setSelectedAlt(c.name || c.id);
                setModalOpen(true);
                console.log(`SetCards: clicked ${c.id}`);
              }}
            />
          </div>
        ))}
      </div>

      <ImageModal
        open={modalOpen}
        src={selectedImage}
        alt={selectedAlt}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
