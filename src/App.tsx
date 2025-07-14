import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./layouts/Layout";
import Courses from "./pages/Courses";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext.tsx";
import AdminHome from "./pages/AdminPanel/AdminHome.tsx";
import "./App.css"; // Import custom CSS for toast styles

import CursorTrail from "./components/Corsor.tsx" // Import custom CSS for cursor styles

import MainCoursePage from "./pages/CoursePage/MainCoursePage.tsx";
import ResourcePage from "./pages/CoursePage/ResourcePage.tsx";
import MockTestPage from "./pages/CoursePage/MockTestPage.tsx";
import VideoLecturesPage from "./pages/CoursePage/VideoLecturesPage.tsx";


function App() {
  return (
    <Router>
      <AuthProvider>
        <CursorTrail />
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="modern-toast-container" // Add custom class for styling
        />
        <Routes>
          <Route path="/" element={<Layout />}>
          
            <Route index element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/:courseName" element={<MainCoursePage />} />
            <Route
              path="/course/:courseName/resources"
              element={<ResourcePage />}
            />
            <Route
              path="/course/:courseName/mock-test"
              element={<MockTestPage />}
            />
            <Route
              path="/course/:courseName/video-lectures"
              element={<VideoLecturesPage />}
            />
            <Route path="/admin" element={<AdminHome />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
