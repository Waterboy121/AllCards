import Header from "../components/Header.tsx";
import Signin from "../components/Signin.tsx";
import Body from "../components/Body.tsx";
import { SignOut } from "../firebase/auth.ts";

function SigninPage() {
  SignOut();
  return (
    <div className="page-background">
      <Header />
      <Body />
      <Signin />
    </div>
  );
}

export default SigninPage;
