import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const VideoLecturesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white text-gray-800 scroll-smooth">
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4">Video Lectures</h2>
          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-6">
              <p className="text-lg text-gray-600 mb-6">
                This section is currently under development. Stay tuned for
                engaging video lectures from expert instructors!
              </p>
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
                onClick={() => window.history.back()}
              >
                Back to Courses
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default VideoLecturesPage;
