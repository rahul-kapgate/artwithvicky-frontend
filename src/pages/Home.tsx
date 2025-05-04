import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-white text-gray-800">
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            Welcome to <span className="text-pink-600">Artistic Vicky</span>
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Discover colors, creativity, and inspiration through the eyes of
            Vicky.
          </p>
          <Button className="text-lg px-6 py-4">Explore Gallery</Button>
        </div>
      </section>

      {/* Featured Artworks */}
      <section className="py-16 bg-white px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-10">
            Featured Artworks
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {["Sunset Bloom", "Mystic Forest", "Urban Calm"].map(
              (title, idx) => (
                <Card
                  key={idx}
                  className="rounded-2xl shadow-md hover:scale-105 transition-transform duration-300"
                >
                  <CardContent className="p-4">
                    <div className="h-48 bg-gray-200 mb-4 rounded-xl flex items-center justify-center">
                      <Sparkles className="h-10 w-10 text-pink-500" />
                    </div>
                    <h3 className="text-xl font-medium">{title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Original painting by Vicky
                    </p>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-pink-50 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4">About</h2>
          <p className="text-gray-700 text-lg mb-6">
            Art Inspiration & BFA Exam Success – Discover a world of artistic
            inspiration through captivating videos on drawing, painting, digital
            art, and more. Simultaneously, navigate your Bachelor of Fine Arts
            journey with our comprehensive exam guides, study strategies, and
            important updates. Join us now to fuel your creativity and conquer
            your BFA exams! 🏆
          </p>
          <Badge
            variant="outline"
            className="text-pink-600 border-pink-500 text-sm"
          >
            Based in India · Available for commissions
          </Badge>
        </div>
      </section>
    </div>
  );
}
