import "../assets/css/WelcomePage.css";
import Heading from "../components/Heading";
import Login from "../components/login";
import MainBody from "../components/MainBody";
import AddCard from "../components/AddCard";
import { SignOut } from "../firebase/auth.ts";

function WelcomePage() {
  SignOut();
  return (
    <div>
      <Heading name="All Cards" size={100} />
      {<AddCard />}
      <MainBody />
      <Login />
    </div>
  );
}

export default WelcomePage;
