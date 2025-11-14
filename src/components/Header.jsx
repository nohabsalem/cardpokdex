import logo from "../assets/img/logo.png"; // chemin relatif depuis src/components
import SearchBar from "./SearchBar";

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
        <SearchBar />
      </div>
    </header>
  );
}

export default Header;
