import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./layouts/Layout";
import Courses from "./pages/Courses";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      {/* ToastContainer for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        {/* Layout wraps all pages */}
        <Route path="/" element={<Layout />}>
          {/* Home page */}
          <Route index element={<Home />} />
          {/* Courses page */}
          <Route path="/courses" element={<Courses />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
