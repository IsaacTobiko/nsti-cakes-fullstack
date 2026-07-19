import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar() {
  return (
    <nav className="bg-maroon-dark text-white px-4 md:px-8 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <img src={logo} alt="NSTI logo" className="h-10 w-10 object-contain" />
      </Link>
    </nav>
  );
}
export default Navbar;
