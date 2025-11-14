import React, { useEffect, useState } from 'react';
import CardDetails from '../components/CardDetails.jsx';

export default function SearchResults({ navigateTo }) {
  const [query, setQuery] = useState('');
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  useEffect(() => {
    const readAndFetch = () => {
      const params = new URLSearchParams(globalThis.location.search || '');
      const q = params.get('q') || '';
      setQuery(q);
      if (q) fetchResults(q);
      else setCards([]);
    };

    // initial read
    readAndFetch();

    // when history changes (pushState / popstate), re-read query and fetch
    const onPop = () => {
      readAndFetch();
    };
    globalThis.addEventListener('popstate', onPop);
    return () => globalThis.removeEventListener('popstate', onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchResults = async (q) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (!resp.ok) throw new Error(`Erreur HTTP ${resp.status}`);
      const data = await resp.json();
      setCards(data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Erreur lors du chargement des résultats');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <button
            onClick={() => (typeof navigateTo === 'function' ? navigateTo('/sets') : (globalThis.location.pathname = '/sets'))}
            className="text-sm text-gray-600 hover:text-gray-800 mr-4"
          >
            ← Retour
          </button>
          <span className="text-sm text-gray-700">{cards.length} résultat(s) pour <strong>{query}</strong></span>
        </div>
        <div>
          {loading && <p>Chargement des résultats...</p>}
          {error && <p className="text-red-600">{error}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div key={c.id} className="flex justify-center">
            <button
              type="button"
              onClick={() => setSelectedCard(c)}
              style={{ border: 'none', background: 'transparent', padding: 0, cursor: 'pointer', width: '100%' }}
            >
              <img
                src={c.small || c.large}
                alt={c.name}
                className="w-full h-auto rounded-lg shadow-sm hover:shadow-md transition-transform hover:scale-105"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/240x320?text=Image+indisponible'; }}
              />
            </button>
          </div>
        ))}
      </div>

      {selectedCard && (
        <CardDetails card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}
    </div>
  );
}
