import "../assets/css/RegisterPage.css";
import Header from "../components/Header";
import Register from "../components/Register";
import { SignOut } from "../firebase/auth";

function RegisterPage() {
  SignOut(); // for some reason if you are still logged in when you reach this page
  return (
    <div className="page-background">
      <Header name="AllCards" size={100} />
      <Register />
    </div>
  );
}

export default RegisterPage;
