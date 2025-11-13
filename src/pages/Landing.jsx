import React from 'react';

export default function Landing({ navigateTo }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-yellow-50 to-white rounded-lg p-8">
      <div className="max-w-4xl text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">CardPokdex</h1>
        <p className="text-lg text-gray-700 mb-6">Une petite application pour parcourir des cartes Pokémon par set.</p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => (typeof navigateTo === 'function' ? navigateTo('/sets') : (window.location.pathname = '/sets'))}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-md font-semibold shadow"
          >
            Parcourir les sets
          </button>

          <button
            onClick={() => (typeof navigateTo === 'function' ? navigateTo('/sets/rsv10pt5') : (window.location.pathname = '/sets/rsv10pt5'))}
            className="bg-white border border-gray-200 text-gray-800 px-6 py-3 rounded-md font-medium shadow-sm"
          >
            Voir un set exemple
          </button>
        </div>
      </div>
    </div>
  );
}
