import "../assets/css/Homepage.css";
import Heading from "../components/Heading";
import Login from "../components/login";
import MainBody from "../components/MainBody";

export default function WelcomePage() {
  return (
    <div>
      <Heading name="All Cards" size={100} />
      <MainBody />
      <Login />
    </div>
  );
}
