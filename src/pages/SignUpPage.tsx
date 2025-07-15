import "../assets/css/SignUpPage.css";
import Heading from "../components/Heading";
import SignUp from "../components/SignUp";
import { SignOut } from "../firebase/auth";

function SignUpPage() {
  SignOut(); // for some reason if you are still logged in when you reach this page
  return (
    <div className="page-background">
      <Heading name="AllCards" size={100} />
      <SignUp />
    </div>
  );
}

export default SignUpPage;
