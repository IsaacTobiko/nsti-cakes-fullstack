import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="bg-maroon-dark text-white px-4 py-4 flex flex-col gap-2">
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
        <a
          href="https://nsti.ac.ke/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2"
        >
          <img
            src={logo}
            alt="NSTI logo"
            className="h-20 w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 object-contain"
          />
        </a>
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/login"
            className="flex items-center gap-2 hover:text-gold transition-colors"
          >
            <i className="fa-solid fa-user text-lg"></i>
            Login/Sign Up
          </Link>

          <Link to="/cart" className="hover:text-gold transition-colors">
            <i className="fa-solid fa-cart-shopping text-lg"></i>
          </Link>

          <Link
            to="/order"
            className="bg-gold hover:bg-gold-light text-maroon-dark font-semibold px-6 py-2 rounded-full transition-colors"
          >
            Order Now
          </Link>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white text-2xl"
          aria-label="Toggle menu"
        >
          <i className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"}`}></i>
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden max-w-6xl mx-auto w-full flex flex-col gap-4 pt-4 border-t border-maroon-light">
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 hover:text-gold transition-colors"
          >
            <i className="fa-solid fa-user"></i>
            Login/Sign Up
          </Link>

          <Link
            to="/cart"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 hover:text-gold transition-colors"
          >
            <i className="fa-solid fa-cart-shopping"></i>
            Cart
          </Link>

          <Link
            to="/order"
            onClick={() => setMenuOpen(false)}
            className="bg-gold hover:bg-gold-light text-maroon-dark font-semibold px-6 py-2 rounded-full text-center transition-colors"
          >
            Order Now
          </Link>
        </div>
      )}

      <p className="max-w-6xl mx-auto w-full text-white font-serif italic text-lg">
        Complete your order below, fresh cakes on their way!
      </p>
    </nav>
  );
}
export default Navbar;
