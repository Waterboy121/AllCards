import "./assets/css/App.css";
import Button from "./components/Button";
import MainBody from "./components/MainBody";
import NavBar from "./components/NavBar";

function App() {
  return (
    <div>
      <NavBar />
      <MainBody />
      <Button
        name="Log In"
        onClicked={() => {
          console.log("Clicked Log In!");
        }}
      />
      <Button
        name="Sign Up"
        onClicked={() => {
          console.log("Clicked Sign In!");
        }}
      />
    </div>
  );
}

export default App;
