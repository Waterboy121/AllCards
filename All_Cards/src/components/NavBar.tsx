import "../assets/css/NavBar.css";
import logo from "../assets/images/icons/logo.png";
import MenuForm from "./popups/MenuForm";
import { useRef, useState } from "react";

import { SearchIcon } from "./logos";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  return (
    <nav className="navbar navbar-dark bg-dark px-4 py-3 d-flex align-items-center justify-content-between">
      {/* Logo section */}
      <div className="tilt-prism-nav d-flex align-items-center justify-content-center">
        <img
          src={logo}
          alt="AllCards logo"
          width="164"
          height="100"
          className="logo-image me-2"
        />
        <span style={{ fontSize: "clamp(1.5rem, 5vw, 4rem)" }}>AllCards</span>
      </div>

      {/* Search bar */}
      <div className="search-container">
        <div className="search-wrapper">
          <button
            className="search-icon-button"
            onClick={() => {
              const input =
                document.querySelector<HTMLInputElement>(".search-input");
              input?.focus();
            }}
          >
            <SearchIcon className="logo-search" />
          </button>
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search through your virtual binder here..."
          />
        </div>
      </div>

      {/* Hamburger menu button */}
      <div ref={menuRef} className="position-relative">
        <button
          className="hamburger-btn flex-shrink-0 ms-4"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className="hamburger-icon">&#9776;</span>
        </button>
        {menuOpen && <MenuForm onClose={() => setMenuOpen(false)} />}
      </div>
    </nav>
  );
}

export default NavBar;
