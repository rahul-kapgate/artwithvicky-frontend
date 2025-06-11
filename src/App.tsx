import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./layouts/Layout";
import Courses from "./pages/Courses";
import CoursePage from "./pages/CoursePage.tsx"; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext.tsx";
import AdminHome from "./pages/AdminPanel/AdminHome.tsx";

function App() {
  return (
    <AuthProvider>
      <Router>
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
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/:courseName" element={<CoursePage />} />{" "}
            {/* New route */}
            <Route path="/admin" element={<AdminHome />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
