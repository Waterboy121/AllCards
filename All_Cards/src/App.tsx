import "./assets/css/App.css";
import Heading from "./components/Heading";
import MainBody from "./components/MainBody";
import Login from "./components/login";
import SignUp from "./components/SignUp";
import SideNav from "./components/SideNav";
import NavBar from "./components/NavBar";

function App() {
  return (
    <div>

      <Heading name="All Cards" size={100} />
      <Login /> 

     {/*  <SideNav /> */}
      

    </div>
  );    
}

export default App;
