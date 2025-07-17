import "../assets/css/NavBar.css";
import logo from "../assets/images/logos/logo2.png";
import searchIcon from "../assets/images/icons/search.svg";
import { useState, useRef, useEffect } from "react";
import HamburgerMenu from "./popups/HamburgerMenu";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Dismiss on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <nav className="navbar navbar-dark bg-dark px-3 py-2 py-md-3 d-flex align-items-center">
      {/* Logo and text */}
      <div className="allcards-logo flex-shrink-0 me-4 d-flex align-items-center">
        <span className="me-2">AllCards</span>
        <img src={logo} alt="AllCards logo" className="logo-image" />
      </div>

      {/* Search bar */}
      <div className="search-container">
        <div className="search-wrapper">
          <img src={searchIcon} alt="Search" className="search-svg-icon" />
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search for your favorite card here..."
          />
        </div>
      </div>

      {/* Hamburger button + menu */}
      <div ref={menuRef} className="position-relative">
        <button
          className="hamburger-btn flex-shrink-0 ms-4"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className="hamburger-icon">&#9776;</span>
        </button>
        {menuOpen && <HamburgerMenu onClose={() => setMenuOpen(false)} />}
      </div>
    </nav>
  );
}

export default NavBar;
