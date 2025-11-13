import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * ImageModal
 * Props:
 * - open: boolean
 * - src: image url
 * - alt: alt text
 * - onClose: function to call when closing
 */
export default function ImageModal({ open, src, alt, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!open) return;
    setMounted(true);

    const onKey = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open && !mounted) return null;

  const handleClose = () => {
    // Play closing animation then call parent's onClose
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setMounted(false);
      onClose && onClose();
    }, 220);
  };

  const contentStyle = {
    transform: closing || !mounted ? 'scale(0.95)' : 'scale(1)',
    opacity: closing || !mounted ? 0 : 1,
    transition: 'transform 200ms ease, opacity 200ms ease',
    maxWidth: '95vw',
    maxHeight: '95vh',
  };

  // Render the modal into document.body to avoid stacking context issues
  return createPortal(
    (
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        style={{
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
        onClick={handleClose}
      >
        <div onClick={(e) => e.stopPropagation()} style={contentStyle}>
          <button
            aria-label="Fermer"
            onClick={handleClose}
            className="absolute top-6 right-6 text-white bg-black/50 rounded-full p-2 hover:bg-black/70"
            style={{ zIndex: 60 }}
          >
            ✕
          </button>

          <img
            src={src}
            alt={alt}
            style={{ maxWidth: '95vw', maxHeight: '95vh', display: 'block', margin: '0 auto' }}
            className="rounded-lg shadow-2xl"
          />
        </div>
      </div>
    ),
    document.body,
  );
}
