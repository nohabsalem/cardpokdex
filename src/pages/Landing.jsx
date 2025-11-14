import React from "react";
import Banner from "../assets/img/banner.jpg";
export default function Landing({ navigateTo }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-yellow-50 to-white rounded-lg p-8">
      <div className="max-w-4xl text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          CardPokdex
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Une petite application pour parcourir des cartes Pokémon par set.
        </p>
        <img
          src={Banner}
          alt="Banner"
          className="w-full h-auto rounded-lg shadow-md mb-6"
        />
        <div className="flex justify-center gap-4">
          <button
            onClick={() =>
              typeof navigateTo === "function"
                ? navigateTo("/sets")
                : (window.location.pathname = "/sets")
            }
            className="cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-md font-semibold shadow"
          >
            Parcourir les sets
          </button>

          <button
            onClick={() =>
              typeof navigateTo === "function"
                ? navigateTo("/sets/rsv10pt5")
                : (window.location.pathname = "/sets/rsv10pt5")
            }
            className=" cursor-pointer bg-white border border-gray-200 hover:bg-gray-100 text-gray-800 px-6 py-3 rounded-md font-medium shadow-sm"
          >
            Voir un set exemple
          </button>
        </div>
      </div>
    </div>
  );
}
