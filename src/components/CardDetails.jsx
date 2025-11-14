import React, { useEffect } from 'react';

function CardModal({ card, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    globalThis.addEventListener('keydown', onKey);
    return () => globalThis.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!card) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 16,
      }}
      onClick={(e) => {
        // close when clicking on backdrop
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 8,
          maxWidth: 960,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          position: 'relative',
          padding: 20,
        }}
      >
        <button
          onClick={onClose}
          aria-label="Fermer"
          style={{
            position: 'absolute',
            right: 12,
            top: 12,
            background: 'transparent',
            border: 'none',
            fontSize: 20,
            cursor: 'pointer',
          }}
        >
          ×
        </button>

        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          <div style={{ flex: '0 0 320px' }}>
            <img
              src={card.large}
              alt={`Carte ${card.name}`}
              style={{ width: '100%', height: 'auto', borderRadius: 6 }}
              onError={(e) => (e.target.src = 'https://via.placeholder.com/300x400?text=Image+indisponible')}
            />
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{ marginTop: 0 }}>{card.name}</h2>
            <div style={{ color: '#555', marginBottom: 12 }}>
              <strong>Set:</strong> {card.set_id || card.set}
              {' — '}
              <strong>Rarity:</strong> {card.rarity || '—'}
            </div>

            <div style={{ marginBottom: 12 }}>
              <strong>Types:</strong> {card.types || '—'}
            </div>

            <div style={{ marginBottom: 12 }}>
              <strong>Artist:</strong> {card.artist || '—'}
            </div>

            {card.flavorText && (
              <div style={{ marginBottom: 12, fontStyle: 'italic', color: '#333' }}>{card.flavorText}</div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default CardModal;
