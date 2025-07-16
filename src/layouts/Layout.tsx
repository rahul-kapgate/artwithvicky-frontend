import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LinksPage from "@/pages/CoursePage/LinkPage";

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to the section when the hash changes (e.g., /#about)
    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen scroll-smooth">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <LinksPage />
      <Footer />
    </div>
  );
}
