import logo from "../assets/logo.png";
import { useState } from "react";
import { Link } from "react-router-dom";
function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <main className="min-h-screen bg-maroon-dark">
      <nav className="flex items-center justify-between px-6 py-4 relative">
        <img src={logo} alt="NSTI Bakery logo" className="h-10" />

        <ul className="hidden md:flex gap-6 text-sm text-white">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/cakes">Cakes</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
        <Link
          to="/signup"
          className="hidden md:block bg-gold text-maroon-dark px-4 py-2 rounded-full text-sm font-semibold"
        >
          Sign Up
        </Link>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white text-2xl cursor-pointer"
        >
          <i className={menuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"} />
        </button>
        {menuOpen && (
          <ul className="absolute top-full left-0 w-full bg-maroon-dark flex flex-col items-center gap-4 py-6 md:hidden">
            <li>
              <Link to="/" onClick={() => setMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/cakes" onClick={() => setMenuOpen(false)}>
                Cakes
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={() => setMenuOpen(false)}>
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => setMenuOpen(false)}>
                Contact
              </Link>
            </li>

            <li>
              <Link to="/signup" onClick={() => setMenuOpen(false)}>
                Sign up
              </Link>
            </li>
          </ul>
        )}
      </nav>
    </main>
  );
}

export default Home;
