export default function Footer() {
  return (
    <footer className="bg-[#3c5aa6] text-white py-6 mt-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Copyright */}
        <div className="flex flex-col justify-center">
          <p className="text-base font-semibold">© 2025 CardPokDex</p>
          <p className="text-sm text-gray-200">Tous droits réservés.</p>
        </div>

        {/* Collaborateurs */}
        <div>
          <p className="text-base font-semibold mb-2">Collaborateurs</p>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            <li className="hover:underline hover:text-gray-300 cursor-pointer">
              Alongkorn
            </li>
            <li className="hover:underline hover:text-gray-300 cursor-pointer">
              Tom
            </li>
            <li className="hover:underline hover:text-gray-300 cursor-pointer">
              Noah
            </li>
            <li className="hover:underline hover:text-gray-300 cursor-pointer">
              Noha
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
