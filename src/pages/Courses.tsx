import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

const courses = [
  {
    _id: "6848338d4ef958e38643f3c3",
    title: "MAH AAC CET Full Preparation Course",
    type: "Full Course",
    description:
      "Complete 6-week program covering Object Drawing, 2D Design, Memory Drawing, and GK. Includes live classes, notes, and mock tests.",
    duration: "6 Weeks",
    level: "Advanced",
    originalPrice: 9999,
    discountedPrice: 7999,
    modules: [
      "Object Drawing",
      "2D Design",
      "Memory Drawing",
      "General Knowledge",
    ],
  },
  {
    _id: "68c1990bb8e0f3986be6abfb",
    title: "MAH AAC CET Mock Test Series",
    type: "Mock Tests Only",
    description:
      "Sharpen your skills with our dedicated mock test package. Practice with realistic exam patterns and improve your time management.",
    duration: "Self-Paced",
    level: "All Levels",
    originalPrice: 1999,
    discountedPrice: 999,
    modules: [
      "10+ Full-Length Mock Tests",
      "Performance Analysis",
      "Answer Keys",
    ],
  },
];

// Helper to make slug from title
const createSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function Courses() {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<
    "login" | "signup" | "forgotPassword"
  >("login");
  const navigate = useNavigate();

  const handleEnrollClick = (courseId: string, courseTitle: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      toast.info("Please login or signup to enroll in the course.");
    } else if (user.authorizedCourses?.includes(courseId)) {
      const slug = createSlug(courseTitle);
      toast.success("Accessing your course...");
      navigate(`/course/${slug}`);
    } else {
      window.open("https://wa.me/9226221871", "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-white px-6 py-20 text-gray-800">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-center text-purple-600 mb-12">
          Explore Our Courses
        </h1>

        {/* Grid of course cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {courses.map((course) => (
            <Card
              key={course._id}
              className="rounded-2xl shadow-lg hover:shadow-xl transition bg-white flex flex-col"
            >
              <CardContent className="p-6 flex flex-col flex-grow">
                {/* Header */}
                <h2 className="text-2xl font-bold text-purple-600 mb-2">
                  {course.title}
                </h2>
                <span className="text-sm text-gray-500 italic mb-4">
                  {course.type}
                </span>

                {/* Description */}
                <p className="text-gray-700 flex-grow">{course.description}</p>

                {/* Quick info */}
                <div className="mt-4 space-y-1 text-sm text-gray-600">
                  <p>📅 Duration: {course.duration}</p>
                  <p>🎯 Level: {course.level}</p>
                  <p>📚 Modules: {course.modules.length}+</p>
                </div>

                {/* Pricing */}
                <div className="mt-6 text-center">
                  <p className="line-through text-gray-400 text-sm">
                    ₹{course.originalPrice}
                  </p>
                  <p className="text-2xl font-extrabold text-green-600">
                    ₹{course.discountedPrice}
                  </p>
                </div>

                {/* Enroll button */}
                <Button
                  onClick={() => handleEnrollClick(course._id, course.title)}
                  className="mt-6 w-full text-lg font-medium py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
                >
                  {user && user.authorizedCourses?.includes(course._id)
                    ? "Access Course"
                    : "Enroll Now"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {isAuthModalOpen && (
        <AuthModal
          mode={authMode}
          onClose={() => setIsAuthModalOpen(false)}
          onSwitchMode={setAuthMode}
          onLoginSuccess={() => {
            toast.success(
              "Login successful! Please select a course to access."
            );
            setIsAuthModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
