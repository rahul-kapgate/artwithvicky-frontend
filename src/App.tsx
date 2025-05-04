import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
// import Login from "./pages/Login";
import Layout from "./layouts/Layout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Wrap all routes that share layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          {/* <Route path="login" element={<Login />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
