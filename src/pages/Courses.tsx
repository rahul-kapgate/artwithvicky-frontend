import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPenNib } from "react-icons/fa"; // pen icon from react-icons
import AuthModal from "./AuthModal";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

const courses = [
  {
    _id: "6848338d4ef958e38643f3c3",
    title: "MAH AAC CET Entrance Exam Preparation",
    description:
      "Get fully prepared for the MAH AAC CET exam with expert-led training. This course covers Object Drawing, 2D Design, Memory Drawing, and General Knowledge (GK), with full access to premium resources.",
    duration: "6 Weeks",
    level: "Advanced",
    originalPrice: 7999,
    discountedPrice: 4999,
    modules: [
      "Object Drawing",
      "2D Designs",
      "Memory Drawing",
      "General Knowledge (GK)",
    ],
    features: [
      "3 instructor-led classes per week",
      "Downloadable notes & eBooks",
      "Monthly mock tests",
      "Access to recorded lectures",
    ],
  },
];

const createSlug = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export default function Courses() {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup" | "forgotPassword">("login");
  const navigate = useNavigate();

  const handleEnrollClick = (courseId: string, courseTitle: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      toast.info("Please login or signup to enroll in the course.");
      return;
    }
    if (user.authorizedCourses?.includes(courseId)) {
      const slug = createSlug(courseTitle);
      toast.success("Accessing your course...");
      navigate(`/course/${slug}`);
    } else {
      toast.error("You are not authorized to access this course.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50 py-20 px-6 md:px-12 lg:px-20 text-gray-900">
      {courses.map((course) => {
        const enrolled = user?.authorizedCourses?.includes(course._id);
        return (
          <section
            key={course._id}
            className="max-w-full mx-auto bg-white rounded-3xl shadow-lg p-10 md:p-16 flex flex-col gap-12"
          >
            {/* Top Title & Badges Row */}
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <h1 className="text-5xl font-extrabold text-purple-700 flex-1">{course.title}</h1>

              <div className="flex gap-4 text-sm md:text-base flex-wrap md:flex-nowrap">
                <span className="bg-purple-100 text-purple-700 px-5 py-2 rounded-full font-semibold shadow-sm">
                  Duration: {course.duration}
                </span>
                <span className="bg-purple-200 text-purple-900 px-5 py-2 rounded-full font-semibold shadow-sm">
                  Level: {course.level}
                </span>
              </div>
            </header>

            {/* Description */}
            <p className="text-gray-700 text-lg max-w-4xl">{course.description}</p>

            {/* Two columns: Modules & Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {/* Modules */}
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-purple-700">📚 Modules Covered</h2>
                <ul className="space-y-4">
                  {course.modules.map((module, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700 text-lg">
                      <FaPenNib className="text-purple-600 flex-shrink-0" />
                      <span>{module}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Features */}
              <div>
                <h2 className="text-2xl font-semibold mb-6 text-purple-700">🎁 What You Get</h2>
                <ul className="space-y-4">
                  {course.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700 text-lg">
                      <FaPenNib className="text-purple-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Price and Enroll Button */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mt-8 border-t border-purple-200 pt-8">
              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-gray-400 line-through text-xl">₹{course.originalPrice}</span>
                <span className="text-4xl font-extrabold text-purple-700">₹{course.discountedPrice}</span>
                <span className="ml-3 inline-block bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow">
                  🎉 Limited Time Offer
                </span>
              </div>

              {/* Button */}
              <button
  onClick={() => handleEnrollClick(course._id, course.title)}
  className="button-86 w-full mt-4 text-base font-medium py-2"
>
  Enroll Now
</button>

            </div>
          </section>
        );
      })}

      {isAuthModalOpen && (
        <AuthModal
          mode={authMode}
          onClose={() => setIsAuthModalOpen(false)}
          onSwitchMode={setAuthMode}
          onLoginSuccess={() => {
            toast.success("Login successful! Please select a course to access.");
            setIsAuthModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
