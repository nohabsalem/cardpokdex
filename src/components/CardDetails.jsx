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
          background: 'transparent',
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

        <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
          <div style={{ flex: '0 0 420px', marginRight: 8 }}>
            <img
              src={card.large}
              alt={`Carte ${card.name}`}
              style={{ width: '100%', height: 'auto', borderRadius: 8, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
              onError={(e) => (e.target.src = 'https://via.placeholder.com/420x560?text=Image+indisponible')}
            />
          </div>

          <div style={{ flex: 1, border: '1px solid #e6e6e6', padding: 20, borderRadius: 8, background: '#fff' }}>
            <h1 style={{ marginTop: 0, marginBottom: 6, fontSize: 26, lineHeight: '1.1', fontWeight: 700 }}>{card.name || '—'}</h1>


            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <div style={{ color: '#444', fontSize: 14 }}><strong>Types</strong></div>
                <div style={{ color: '#222' }}>{card.types || '—'}</div>
              </div>
              <div>
                <div style={{ color: '#444', fontSize: 14 }}><strong>Rarity</strong></div>
                <div style={{ color: '#222' }}>{card.rarity || '—'}</div>
              </div>
              <div>
                <div style={{ color: '#444', fontSize: 14 }}><strong>Artist</strong></div>
                <div style={{ color: '#222' }}>{card.artist || '—'}</div>
              </div>
              <div>
                <div style={{ color: '#444', fontSize: 14 }}><strong>Flavor</strong></div>
                <div style={{ color: '#333', fontStyle: 'italic' }}>{card.flavorText || '—'}</div>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardModal;
