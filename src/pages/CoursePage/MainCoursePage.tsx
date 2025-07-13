import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";

const MainCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const param = useParams();

  const courses = [
    {
      title: "Resources",
      description:
        "Access comprehensive study materials and guides to enhance your learning experience.",
      url: `/course/${param.courseName}/resources`,
    },
    {
      title: "Mock Test",
      description:
        "Practice with our mock tests to prepare effectively for your exams.",
      url: `/course/${param.courseName}/mock-test`,
    },
    {
      title: "Video Lectures",
      description:
        "Learn from engaging video lectures crafted by expert instructors.",
      url: `/course/${param.courseName}/video-lectures`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white text-gray-800 scroll-smooth">
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-10">
            Our Courses
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, idx) => (
              <Card
                key={idx}
                className="rounded-2xl shadow-md hover:scale-105 transition-transform duration-300 h-full"
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <h3 className="text-xl font-medium mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {course.description}
                  </p>
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
                    onClick={() => navigate(course.url)}
                  >
                    Explore {course.title}
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
