import logo from "../assets/images/icons/logo.png";
import MenuForm from "./popups/MenuForm";
import { useRef, useState } from "react";

import { SearchIcon, MenuIcon } from "./logos";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  return (
    <nav className="container-navbar">
      {/* Logo section */}
      <div className="hover-sync flex-left">
        <img src={logo} alt="AllCards logo" className="logo-allcards" />
        <span className="tilt-prism-logo-navbar">AllCards</span>
      </div>

      {/* Search bar */}
      <div className="container-search">
        <div className="wrapper-search">
          <button
            className="button-search-icon"
            onClick={() => {
              const input =
                document.querySelector<HTMLInputElement>(".search-input");
              input?.focus();
            }}
          >
            <SearchIcon className="icon-search" />
          </button>
          <input
            type="text"
            className="search-input"
            placeholder="Search through your virtual binder here..."
          />
        </div>
      </div>

      {/* Hamburger menu button */}
      <div ref={menuRef} className="position-relative">
        <button
          className="button-menu"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <MenuIcon className="icon-menu" />
        </button>
        {menuOpen && <MenuForm onClose={() => setMenuOpen(false)} />}
      </div>
    </nav>
  );
}

export default NavBar;
