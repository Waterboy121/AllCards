import "../assets/css/WelcomePage.css";
import Heading from "../components/Heading";
import Login from "../components/login";
import MainBody from "../components/MainBody";
import { SignOut } from "../firebase/auth.ts";

function WelcomePage() {
  SignOut();
  return (
    <div className="page-background">
      <Heading name="AllCards" size={100} />
      <MainBody />
      <Login />
    </div>
  );
}

export default WelcomePage;
