import "./assets/css/App.css";
import Heading from "./components/Heading";
import MainBody from "./components/MainBody";

function App() {
  return (
    <div>
      <Heading name="All Cards" size={100} />
      <MainBody />
    </div>
  );
}

export default App;
