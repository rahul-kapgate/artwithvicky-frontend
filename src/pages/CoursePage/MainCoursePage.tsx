import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";

const MainCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const param = useParams();

  // define modules for Full Course and Mock Test
  const allModules = [
    {
      title: "Resources",
      description:
        "Access comprehensive study materials and guides to enhance your learning experience.",
      key: "resources",
    },
    {
      title: "Mock Test",
      description:
        "Practice with our mock tests to prepare effectively for your exams.",
      key: "mock-test",
    },
    {
      title: "Video Lectures",
      description:
        "Learn from engaging video lectures crafted by expert instructors.",
      key: "video-lectures",
    },
  ];

  // For mock-test course, show only the mock-test module
  const modulesToShow =
    param.courseName === "mah-aac-cet-mock-test-series"
      ? allModules.filter((m) => m.key === "mock-test")
      : allModules;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white text-gray-800 scroll-smooth">
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-10">
            {param.courseName === "mock-test-course"
              ? "Mock Test Course"
              : "Full Course"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {modulesToShow.map((module, idx) => (
              <Card
                key={idx}
                className="rounded-2xl shadow-md hover:scale-105 transition-transform duration-300 h-full"
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <h3 className="text-xl font-medium mb-2">{module.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {module.description}
                  </p>
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
                    onClick={() =>
                      navigate(`/course/${param.courseName}/${module.key}`)
                    }
                  >
                    Explore {module.title}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default MainCoursePage;
