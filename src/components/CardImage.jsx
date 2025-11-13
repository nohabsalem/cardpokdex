import React, { useState, useEffect } from 'react';
import ImageModal from './ImageModal';

/**
 * CardImage Component
 * Affiche uniquement l'image d'une carte Pokémon
 * @param {string} cardId - L'ID unique de la carte (ex: 'rsv10pt5-1')
 */
function CardImage({ cardId }) {
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Si l'ID est manquant, on ne fait rien
    if (!cardId) {
      setError('Aucun ID de carte fourni');
      return;
    }

    const fetchCard = async () => {
      setLoading(true);
      setError(null);
      setCard(null);

      const apiUrl = `http://127.0.0.1:5000/api/card/${cardId}`;

      try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Carte avec l'ID "${cardId}" non trouvée`);
          } else {
            throw new Error(`Erreur serveur: ${response.status}`);
          }
        }

        const data = await response.json();

        // Valide que les données nécessaires sont présentes (small ou large)
        if (!(data.large || data.small) || !data.name) {
          throw new Error('Données de carte invalides');
        }

        setCard(data);
      } catch (err) {
        console.error('Erreur lors de la récupération de la carte:', err);
        setError(err.message || 'Erreur lors du chargement de la carte');
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [cardId]);

  // État de chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2"></div>
      </div>
    );
  }

  // État d'erreur
  if (error) {
    return (
      <div className="bg-red-100 border-2 border-red-500 rounded-lg p-4 text-center text-sm">
        <p className="text-red-700 font-semibold">⚠️ {error}</p>
      </div>
    );
  }

  // État sans données
  if (!card) {
    return null;
  }

  // Affichage de l'image uniquement (utilise small comme vignette si disponible)
  const thumb = card.small || card.large;
  const largeImage = card.large || card.small;

  return (
    <div className="flex justify-center">
      <img
        src={thumb}
        alt={`Carte Pokémon: ${card.name}`}
        className="w-full h-auto bg-transparent hover:scale-105 transition-transform cursor-pointer"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/300x400?text=Image+indisponible';
        }}
        onClick={() => {
          console.log(`CardImage: ouverture modal pour ${card.id}`);
          setOpen(true);
        }}
      />
      <ImageModal open={open} src={largeImage} alt={card.name} onClose={() => setOpen(false)} />
    </div>
  );
}

export default CardImage;