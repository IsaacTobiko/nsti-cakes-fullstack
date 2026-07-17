import { link } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar() {
  return (
    <nav className="bg-maroon-dark text-white px-4 md:px-8 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <img src="" alt="NSTI logo" className="h-10 w-10 object-contain" />
        <div className="leading-tight">
          <p className="font-bold text-sm sm:text-base">
            Nairobi South Training Institute.
          </p>
          <p className="text-gold-light text-[10px] sm:text-xs italic">
            Your Skills Your Future
          </p>
        </div>
      </Link>
    </nav>
  );
}
