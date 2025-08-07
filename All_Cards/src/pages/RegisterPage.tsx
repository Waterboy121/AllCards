import "../assets/css/RegisterPage.css";
import Header from "../components/Header";
import Register from "../components/Register";
import { SignOut } from "../firebase/auth";

function RegisterPage() {
  SignOut(); // for some reason if you are still logged in when you reach this page
  return (
    <div className="page-background">
      <Header name="AllCards" size={100} />
      <div className="header-bg">
        <h3 className="cinzel-body text-center mt-4 pt-2 royal-header animate-in animate-delay-1 pulse">
          Your Binder. Your Realm. Built for Glory.
        </h3>

        <h3 className="cinzel-body text-center mt-2 royal-header animate-in animate-delay-2 pulse">
          Your Cards Deserve More Than Storage. They Deserve a Throne.
        </h3>
      </div>

      <div
        className="mx-auto bg-white my-3"
        style={{ width: "88%", height: "1px" }}
      ></div>
      <Register />
    </div>
  );
}

export default RegisterPage;
