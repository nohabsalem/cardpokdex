import logo from "../assets/img/logo.png"; // chemin relatif depuis src/components
import SearchBar from "./SearchBar";

import { Link } from "react-router-dom";
function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-[#3c5aa6] shadow-md">
      <div>
        <img src={logo} alt="Logo" className="h-16 w-auto" />
      </div>

      <div>
        <SearchBar />
      </div>
    </header>
  );
}

export default Header;
