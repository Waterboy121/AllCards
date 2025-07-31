import "../assets/css/NavBar.css";
import "../assets/css/ProfilePage.css";
import logo from "../assets/images/icons/logo.png";
import UpdateProfile from "../components/Updateprofile";



function ProfilePage(){
    return(
        <> <div className="background-page ">
        <nav className="navbar navbar-dark bg-dark px-4 py-3 d-flex  w-100% align-items-center justify-content-between">
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
      <div className="  ">
        <UpdateProfile />
      </div>
      </div >
      </>
    );
}
export default ProfilePage;