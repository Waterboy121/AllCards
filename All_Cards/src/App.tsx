import "./assets/css/App.css";
import Heading from "./components/Heading";
import MainBody from "./components/MainBody";
import Login from "./components/login";

function App() {
  return (
    <div>
      <Heading name="All Cards" size={100} />
      <MainBody />
      <Login />
    </div>
  );
}

export default App;
