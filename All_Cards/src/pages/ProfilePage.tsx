import "../assets/css/NavBar.css";
import logo from "../assets/images/icons/logo.png";
import UpdateProfile from "../components/Updateprofile";
import { Link } from "react-router-dom";

function ProfilePage(){
    return(
        <>
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
      </nav>
      <Link to="/homepage">
                <button
                  type="button"
                  className="btn btn-outline-secondary position-absolute top-50 start-0 translate-middle-y"
                  aria-label="Back"
                >
                  <i
                    className="bi bi-arrow-left"
                    style={{ color: "#f5f5f5" }}
                  ></i>
                </button>
              </Link>

      <main className="container mt-4">
        <h1 className="mb-4">Profile Page</h1>
        <UpdateProfile />
      </main>
      </>
    );
}
export default ProfilePage;