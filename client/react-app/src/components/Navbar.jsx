import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar() {
  return (
    <nav className="bg-maroon-dark text-white px-4 md:px-8 py-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="NSTI logo"
            className="h-10 w-10 object-contain"
          />
        </Link>
      </div>
      <p className="text-gold font-serif italic text-lg">
        Complete your order below, fresh cakes on their way!
      </p>
    </nav>
  );
}
export default Navbar;
