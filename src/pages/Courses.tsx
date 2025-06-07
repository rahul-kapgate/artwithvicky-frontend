import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const courses = [
  {
    title: "MAH AAC CET Entrance Exam Preparation",
    description:
      "Get fully prepared for the MAH AAC CET exam with expert-led training. This course covers key areas like Object Drawing, 2D Design, Memory Drawing, and General Knowledge (GK), with full access to premium study resources.",
    duration: "6 Weeks",
    level: "Advanced",
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

export default function Courses() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-pink-50 to-white px-4 py-20 text-gray-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-pink-600">
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
                <h2 className="text-2xl sm:text-3xl font-semibold text-pink-700">
                  {course.title}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {course.description}
                </p>

                <div>
                  <h3 className="text-pink-600 font-semibold mb-2">
                    📚 Modules Covered
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {course.modules.map((module, i) => (
                      <li key={i}>{module}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-pink-600 font-semibold mb-2">
                    🎁 Course Includes
                  </h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {course.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                </div>

                {/* <div className="text-sm text-gray-500 pt-2">
                  <span className="block">🕒 Duration: {course.duration}</span>
                  <span className="block">📈 Level: {course.level}</span>
                </div> */}

                {/* test */}

                <div className="pt-4">
                  <Button className="w-full text-base font-medium py-2">
                    Enroll Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
