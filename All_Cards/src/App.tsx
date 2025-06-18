// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import "./assets/css/App.css";
// import Heading from "./components/Heading";
// import MainBody from "./components/MainBody";
// import Login from "./components/login";

// function App() {
//   return (
//     <div>
//       <Heading name="All Cards" size={100} />
//       <MainBody />
//       <Login />
//     </div>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './assets/css/App.css';
import Heading from './components/Heading';
import MainBody from './components/MainBody';
import Login from './components/login';
import SignUp from './components/SignUp';
import TcgTestPage from './components/TcgTestPage'; // NEW

function App() {
  return (
    <Router>
      <div>
        <Heading name="All Cards" size={100} />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<MainBody />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/tcgtest" element={<TcgTestPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;