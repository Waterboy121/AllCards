import "../assets/css/NavBar.css";
import "../assets/css/font.css";
import logo from "../assets/logo.png";

function NavBar() {
  return (
    <>
      <div className="d-flex justify-content-between align-items-center px-4 py-3 bg-dark text-white">
        <a href="#" className="nav-link">
          <h1 className="pixelify-sans">
            <img src={logo} className="me-2" width="64" height="64" />
            All Cards
          </h1>
        </a>
        <nav className="nav nav-tabs">
          <a className="nav-link pixelify-sans fs-4" key="home" href="#">
            Home
          </a>
          <a className="nav-link pixelify-sans fs-4" key="aboutus" href="#">
            About Us
          </a>
          <a className="nav-link pixelify-sans fs-4" key="login" href="#">
            Login
          </a>
          <a className="nav-link pixelify-sans fs-4" key="signup" href="#">
            Sign up
          </a>
          <a className="nav-link pixelify-sans fs-4" key="faqs" href="#">
            FAQs
          </a>
        </nav>
      </div>
    </>
  );
}

export default NavBar;
