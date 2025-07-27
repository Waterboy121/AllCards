import logo from "../assets/images/icons/logo.png";

function Header() {
  return (
    <>
      <div className="hover-sync flex-center">
        <img src={logo} alt="AllCards logo" className="logo-allcards" />
        <span className="tilt-prism-logo-welcome">AllCards</span>
      </div>
    </>
  );
}

export default Header;
