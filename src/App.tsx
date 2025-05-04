import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./layouts/Layout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Layout wraps all pages */}
        <Route path="/" element={<Layout />}>
          {/* Home page */}
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
