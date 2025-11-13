import React, { useState, useEffect } from 'react';

/**
 * SetImage Component
 * Affiche un ensemble (Set) Pokémon avec son logo et ses détails
 * @param {string} setId - L'ID unique du set (ex: 'rsv10pt5')
 */
function SetImage({ setId }) {
  const [set, setSet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Si l'ID est manquant, on ne fait rien
    if (!setId) {
      setError('Aucun ID de set fourni');
      return;
    }

    const fetchSet = async () => {
      setLoading(true);
      setError(null);
      setSet(null);

      const apiUrl = `http://127.0.0.1:5000/api/set/${setId}`;

      try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Set avec l'ID "${setId}" non trouvé`);
          } else {
            throw new Error(`Erreur serveur: ${response.status}`);
          }
        }

        const data = await response.json();

        // Valide que les données nécessaires sont présentes
        if (!data.logo || !data.name) {
          throw new Error('Données de set invalides');
        }

        setSet(data);
      } catch (err) {
        console.error('Erreur lors de la récupération du set:', err);
        setError(err.message || 'Erreur lors du chargement du set');
      } finally {
        setLoading(false);
      }
    };

    fetchSet();
  }, [setId]);

  // État de chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        <span className="ml-3 text-gray-700 font-semibold">Chargement du set...</span>
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <div className="bg-red-100 border-2 border-red-500 rounded-lg p-6 text-center">
        <p className="text-red-700 font-semibold text-lg">⚠️ Erreur</p>
        <p className="text-red-600 mt-2">{error}</p>
        <p className="text-gray-600 text-sm mt-4">ID fourni: <code className="bg-red-50 px-2 py-1 rounded">{setId}</code></p>
      </div>
    );
  }

  // État sans données
  if (!set) {
    return (
      <div className="bg-yellow-100 border-2 border-yellow-500 rounded-lg p-6 text-center">
        <p className="text-yellow-700 font-semibold">Aucun set à afficher</p>
      </div>
    );
  }

  // Affichage du set
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
      <div className="p-6">
        {/* Nom et série */}
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-gray-800">{set.name}</h3>
          {set.series && (
            <p className="text-sm text-gray-600">Série: {set.series}</p>
          )}
        </div>

        {/* Logo du set */}
        <div className="flex justify-center mb-4">
          <img
            src={set.logo}
            alt={`Logo du set: ${set.name}`}
            className="max-w-xs h-auto rounded-lg border-4 border-purple-400 shadow-md hover:scale-105 transition-transform bg-gray-50 p-4"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/200x150?text=Logo+indisponible';
            }}
          />
        </div>

        {/* Détails du set */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {set.total && (
            <div>
              <p className="text-gray-600 font-semibold">Total de Cartes</p>
              <p className="text-2xl font-bold text-purple-600">{set.total}</p>
            </div>
          )}
          {set.releaseDate && (
            <div>
              <p className="text-gray-600 font-semibold">Date de Sortie</p>
              <p className="text-gray-800">{new Date(set.releaseDate).toLocaleDateString('fr-FR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
          )}
        </div>

        {/* ID du set */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          ID: {set.id}
        </div>
      </div>
    </div>
  );
}

export default SetImage;
