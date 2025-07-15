import "../assets/css/NavBar.css";
import logo from "../assets/images/icons/logo-alt.png";

import { SearchIcon } from "./logos";

function NavBar() {
  return (
    <nav className="navbar navbar-dark bg-dark px-3 py-2 py-md-3 d-flex align-items-center">
      {/* Logo section */}
      <div className="d-flex align-items-center flex-shrink-0 me-4">
        <span className="handjet-logo me-2">AllCards</span>
        <img src={logo} alt="AllCards logo" className="logo-image" />
      </div>

      {/* Search bar */}
      <div className="search-container">
        <div className="search-wrapper">
          <SearchIcon className="logo-search" />
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search through your virtual binder here..."
          />
        </div>
      </div>

      {/* Hamburger menu button */}
      <button className="hamburger-btn flex-shrink-0 ms-4">
        <span className="hamburger-icon">&#9776;</span>
      </button>
    </nav>
  );
}

export default NavBar;
