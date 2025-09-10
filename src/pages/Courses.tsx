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
    title: "MAH AAC CET Entrance Exam Preparation",
    description:
      "Get fully prepared for the MAH AAC CET exam with expert-led training. This course covers key areas like Object Drawing, 2D Design, Memory Drawing, and General Knowledge (GK), with full access to premium study resources.",
    duration: "6 Weeks",
    level: "Advanced",
    originalPrice: 9999,
    discountedPrice: 5999,
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

// Helper function to create a URL-friendly slug from the course title
const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export default function Courses() {
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<
    "login" | "signup" | "forgotPassword"
  >("login");
  const navigate = useNavigate();

  const handleEnrollClick = (courseId: string, courseTitle: string) => {
    if (!user) {
      // User is not logged in, show the auth modal
      setIsAuthModalOpen(true);
      toast.info("Please login or signup to enroll in the course.");
    } else if (user.authorizedCourses?.includes(courseId)) {
      // User is logged in and authorized, navigate to course page
      const slug = createSlug(courseTitle);
      toast.success("Accessing your course...");
      navigate(`/course/${slug}`);
    } else {
      // User is logged in but not authorized for this course
      window.open("https://wa.me/9226221871", "_blank");
    }
  };

  const handleCloseModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleSwitchMode = (newMode: "login" | "signup" | "forgotPassword") => {
    setAuthMode(newMode);
  };

  const handleLoginSuccess = () => {
    toast.success("Login successful! Please select a course to access.");
    setIsAuthModalOpen(false);
  };

  const course = courses[0]; // Since there's only one course

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-white px-4 py-20 text-gray-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Course Title and Subtitle */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-purple-600">
            {course.title}
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Boost your chances of success in the entrance exam with expert-led
            sessions and full resources 🎨
          </p>
        </div>

        {/* Not Your Average Course Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-purple-700 mb-4 text-center">
            Not your average entrance exam course
          </h2>
          <p className="text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
            Built around interactive practice and packed with real-world
            preparation challenges, this comprehensive bootcamp stands out with
            features that make it truly unique. Get lifetime access including
            future updates and a certificate of completion.
          </p>
        </section>

        {/* Course Overview Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-purple-700 mb-4 text-center">
            Course Overview
          </h2>
          <p className="text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
            {course.description}
          </p>
        </section>

        {/* Features Grid */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-purple-700 mb-6 text-center">
            Master MAH AAC CET Preparation
          </h2>
          <p className="text-gray-600 mb-4 text-center">
            Complete course with expert-led classes, real-world challenges, and
            more. Get ready to deploy your skills in 6 weeks. Perfect for
            aspiring artists and designers.
          </p>
          <p className="text-gray-600 mb-8 text-center">
            Level up risk-free – contact us for details.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="rounded-xl shadow-md text-center p-6">
              <CardContent>
                <h3 className="text-2xl font-bold text-purple-600">6+</h3>
                <p className="text-gray-700">Weeks Duration</p>
              </CardContent>
            </Card>
            <Card className="rounded-xl shadow-md text-center p-6">
              <CardContent>
                <h3 className="text-2xl font-bold text-purple-600">Advanced</h3>
                <p className="text-gray-700">Level</p>
              </CardContent>
            </Card>
            <Card className="rounded-xl shadow-md text-center p-6">
              <CardContent>
                <h3 className="text-2xl font-bold text-purple-600">4+</h3>
                <p className="text-gray-700">Modules</p>
              </CardContent>
            </Card>
            <Card className="rounded-xl shadow-md text-center p-6">
              <CardContent>
                <h3 className="text-2xl font-bold text-purple-600">Expert</h3>
                <p className="text-gray-700">Guidance</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Modules and Includes Sections */}
        <section className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-semibold text-purple-600 mb-4">
              📚 Modules Covered
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {course.modules.map((module, i) => (
                <li key={i}>{module}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-purple-600 mb-4">
              🎁 Course Includes
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {course.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Enrollment/Pricing Section */}
        <section className="mb-12">
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-8 text-center max-w-2xl mx-auto">
            <div className="text-gray-500 text-lg line-through mb-1">
              ₹{course.originalPrice}
            </div>
            <div className="text-4xl font-extrabold text-green-600 mb-2">
              ₹{course.discountedPrice}
              <span className="ml-2 text-lg font-medium text-gray-600">
                only
              </span>
            </div>
            <span className="inline-block text-sm text-white bg-purple-500 px-4 py-1 rounded-full shadow-sm mb-6">
              🎉 Limited Time Offer
            </span>
            {user && user.authorizedCourses?.includes(course._id) ? (
              <Button
                onClick={() => handleEnrollClick(course._id, course.title)}
                className="w-full bg-green-600 hover:bg-green-700 text-white text-lg font-medium py-3"
              >
                Access Course
              </Button>
            ) : (
              <Button
                onClick={() => handleEnrollClick(course._id, course.title)}
                className="w-full text-lg font-medium py-3"
              >
                Enroll Now
              </Button>
            )}
          </div>
        </section>
      </div>

      {isAuthModalOpen && (
        <AuthModal
          mode={authMode}
          onClose={handleCloseModal}
          onSwitchMode={handleSwitchMode}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}
