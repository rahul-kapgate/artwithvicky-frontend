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
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
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
      toast.error("You are not authorized to access this course.");
    }
  };

  const handleCloseModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleSwitchMode = (newMode: "login" | "signup") => {
    setAuthMode(newMode);
  };

  const handleLoginSuccess = () => {
    toast.success("Login successful! Please select a course to access.");
    setIsAuthModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50 to-white px-4 py-20 text-gray-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-purple-600">
            MAH AAC CET Prep Course
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Boost your chances of success in the entrance exam with expert-led
            sessions and full resources 🎨
          </p>
        </div>

        <div className="flex justify-center">
          {courses.map((course, idx) => (
            <Card
              key={idx}
              className="rounded-2xl shadow-lg hover:shadow-xl transition duration-300 w-full max-w-3xl"
            >
              <CardContent className="p-8 space-y-6 text-left">
                <h2 className="text-2xl sm:text-3xl font-semibold text-purple-700">
                  {course.title}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {course.description}
                </p>

                <div>
                  <h3 className="text-purple-600 font-semibold mb-2">
                    📚 Modules Covered
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {course.modules.map((module, i) => (
                      <li key={i}>{module}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-purple-600 font-semibold mb-2">
                    🎁 Course Includes
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {course.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4">
                  {user && user.authorizedCourses?.includes(course._id) ? (
                    <div className="text-center">
                      <p className="text-lg font-semibold text-green-600 mb-4">
                        Enrolled
                      </p>
                      <Button
                        onClick={() =>
                          handleEnrollClick(course._id, course.title)
                        }
                        className="w-full bg-green-600 hover:bg-green-700 text-white text-base font-medium py-2"
                      >
                        Access Course
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4 text-center">
                      <div className="text-gray-500 text-sm line-through">
                        ₹{course.originalPrice}
                      </div>
                      <div className="text-2xl font-extrabold text-green-600">
                        ₹{course.discountedPrice}
                        <span className="ml-2 text-sm font-medium text-gray-600">
                          only
                        </span>
                      </div>
                      <span className="inline-block mt-2 text-xs text-white bg-purple-500 px-3 py-1 rounded-full shadow-sm">
                        🎉 Limited Time Offer
                      </span>
                      <Button
                        onClick={() =>
                          handleEnrollClick(course._id, course.title)
                        }
                        className="w-full mt-4 text-base font-medium py-2"
                      >
                        Enroll Now
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
