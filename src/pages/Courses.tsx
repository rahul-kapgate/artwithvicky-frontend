import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const courses = [
  {
    title: "Beginner's Sketching Bootcamp",
    description:
      "Learn fundamental sketching techniques with easy-to-follow exercises.",
    duration: "4 Weeks",
    level: "Beginner",
  },
];

export default function Courses() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-pink-50 to-white px-4 py-20 text-gray-800">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4 text-pink-600">Our Courses</h1>
        <p className="text-lg text-gray-600 mb-12">
          Join our carefully curated courses and take your art to the next level
          🎨
        </p>

        <div
          className={`grid gap-8 ${
            courses.length === 1
              ? "grid-cols-1 place-items-center"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {courses.map((course, idx) => (
            <Card
              key={idx}
              className="rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 w-full max-w-md"
            >
              <CardContent className="p-6 text-left space-y-4">
                <h2 className="text-2xl font-semibold text-pink-700">
                  {course.title}
                </h2>
                <p className="text-gray-600">{course.description}</p>
                <div className="text-sm text-gray-500">
                  <span className="block">🕒 Duration: {course.duration}</span>
                  <span className="block">📈 Level: {course.level}</span>
                </div>
                <Button className="mt-4">Enroll Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
