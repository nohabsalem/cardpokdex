import logo from "../assets/img/logo.png"; // chemin relatif depuis src/components
import { Link } from "react-router-dom";
function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-gray-400">
      <div>
        <Link to="/">
          {" "}
          <img src={logo} alt="Logo" className="h-16 w-auto" />
        </Link>
      </div>

      <div>
        <input
          type="text"
          placeholder="Search..."
          className="cursor-pointer border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled
        />
      </div>
    </header>
  );
}

export default Header;
