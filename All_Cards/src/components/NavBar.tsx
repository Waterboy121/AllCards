import "../assets/css/NavBar.css";
import logo from "../assets/images/logos/logo2.png";
import searchIcon from "../assets/images/icons/search.svg";

function NavBar() {
  return (
    <nav className="navbar navbar-dark bg-dark px-3 py-2 py-md-3 d-flex align-items-center">
      <div className="allcards-logo flex-shrink-0 me-4 d-flex align-items-center">
        <span className="me-2">AllCards</span>
        <img src={logo} alt="AllCards logo" className="logo-image" />
      </div>

      <div className="search-container">
        <div className="search-wrapper">
          <img src={searchIcon} alt="Search" className="search-svg-icon" />
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search through your virtual binder here..."
          />
        </div>
      </div>

      <button className="hamburger-btn flex-shrink-0 ms-4">
        <span className="hamburger-icon">&#9776;</span>
      </button>
    </nav>
  );
}

export default NavBar;
