import Heading from "../components/Heading";
import SignUp from "../components/SignUp";
import { SignOut } from "../firebase/auth";

function SignUpPage() {
  SignOut(); //for some reason if you are still logged in when you reach this page
  return (
    <>
      <Heading name="All Cards" size={100} />
      <SignUp />
    </>
  );
}

export default SignUpPage;
