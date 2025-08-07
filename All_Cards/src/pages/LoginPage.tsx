import "../assets/css/LoginPage.css";
import Header from "../components/Header";
import Login from "../components/login.tsx";
import Body from "../components/Body";
import { SignOut } from "../firebase/auth.ts";

function LoginPage() {
  SignOut();
  return (
    <div className="page-background">
      <Header name="AllCards" size={100} />
      <Body />
      <Login />
    </div>
  );
}

export default LoginPage;
