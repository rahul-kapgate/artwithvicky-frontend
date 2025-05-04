import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "./pages/login.tsx"
import Home from "./pages/Home.tsx";


function App() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Login />} /> */}
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
