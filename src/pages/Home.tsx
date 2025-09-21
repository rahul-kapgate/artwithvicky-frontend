import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
//@ts-ignore
import "swiper/css";
//@ts-ignore
import "swiper/css/autoplay";
import axios from "axios";
import { useEffect, useState } from "react";
import { Autoplay } from "swiper/modules";
import { Palette, Heart, Globe, Star, Layers, Brush } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import AuthModal from "./AuthModal";

// ---------- Interfaces ----------
interface Artwork {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
}

// ---------- Contact Links ----------
const contactLinks = [
  {
    label: "WhatsApp",
    url: "https://wa.me/9226221871",
    display: "9226221871",
    icon: "📱",
  },
  {
    label: "E-mail",
    url: "mailto:vikkitembhurne358@gmail.com",
    display: "vikkitembhurne358@gmail.com",
    icon: "✉️",
  },
  {
    label: "WhatsApp Group",
    url: "https://chat.whatsapp.com/KYAuVuPVR8xJ8eXbTLvDl3",
    icon: "👥",
  },
  {
    label: "Instagram",
    url: "https://www.instagram.com/artistic.vicky/",
    icon: "📸",
  },
  {
    label: "YouTube",
    url: "https://www.youtube.com/@artisticvicky",
    icon: "🎥",
  },
  {
    label: "Facebook",
    url: "https://www.facebook.com/mayur.tembhurne.148",
    icon: "👥",
  },
];

// ---------- Courses ----------
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
    discountedPrice: 5999,
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

// ---------- Reasons Section ----------
const reasons = [
  {
    icon: <Star className="w-8 h-8 text-pink-500" />,
    title: "Unique Creativity",
    desc: "Every artwork is crafted with originality, blending modern techniques with timeless styles.",
  },
  {
    icon: <Heart className="w-8 h-8 text-red-500" />,
    title: "Personal Expression",
    desc: "Art that speaks emotions, stories, and imagination beyond words.",
  },
  {
    icon: <Layers className="w-8 h-8 text-indigo-500" />,
    title: "Diverse Portfolio",
    desc: "From digital illustrations to traditional paintings, explore a wide range of creative expressions.",
  },
  {
    icon: <Brush className="w-8 h-8 text-green-500" />,
    title: "Custom Creations",
    desc: "Personalized artworks designed to reflect your vision, style, or brand.",
  },
  {
    icon: <Palette className="w-8 h-8 text-yellow-500" />,
    title: "Passion for Art",
    desc: "Driven by love for creativity, each piece is made with dedication and detail.",
  },
  {
    icon: <Globe className="w-8 h-8 text-blue-500" />,
    title: "Global Reach",
    desc: "Connect with art lovers worldwide through exhibitions and digital platforms.",
  },
];

// ---------- Helper ----------
const createSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// ---------- Main Component ----------
export default function Home() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup" | "forgotPassword">("login");
  const navigate = useNavigate();

  // Fetch images from backend API
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get(
        "https://artwithvicky-backend.onrender.com/api/images/get-images"
      );
      setArtworks(response.data.data);
    } catch (error) {
      console.error("Error fetching artworks:", error);
    }
  };

  // Handle course enroll
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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white text-gray-800 scroll-smooth">
      {/* ---------------- Hero Section ---------------- */}
      <section className="text-center py-20 px-4 bg-gradient-to-b from-purple-50 via-white to-white">
        <div className="max-w-5xl mx-auto">
          {/* Title */}
          <h1 className="text-5xl font-bold mb-4">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-800 bg-clip-text text-transparent">
              Artistic Vicky
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover colors, creativity, and inspiration through the eyes of
            Vicky.
          </p>

          {/* Intro Video */}
          <div className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl mb-8">
            <iframe
              className="w-full h-64 sm:h-96"
              src="https://www.youtube.com/embed/R_9NzB6LzEY?autoplay=1&mute=1&loop=1&playlist=R_9NzB6LzEY&controls=1&rel=0"
              title="Intro Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* ---------------- Courses Section ---------------- */}
      <section id="courses" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6 text-center">Our Courses</h2>
          <p className="text-gray-600 text-lg text-center mb-12">
            Unlock your creativity and build your skills with our exclusive art courses.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Card
                key={course._id}
                className="rounded-2xl shadow-md hover:shadow-xl transition duration-300 flex flex-col"
              >
                <CardContent className="p-6 flex flex-col flex-grow">
                  {/* Title & Type */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-purple-700 mb-1">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500">{course.type}</p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm flex-grow mb-4">
                    {course.description}
                  </p>

                  {/* Duration & Level */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span>⏳ {course.duration}</span>
                    <span>📘 {course.level}</span>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <p className="text-gray-500 text-sm line-through">
                      ₹{course.originalPrice}
                    </p>
                    <p className="text-2xl font-bold text-purple-700">
                      ₹{course.discountedPrice}
                    </p>
                  </div>

                  {/* Modules */}
                  <div className="mb-4">
                    <p className="font-semibold text-gray-700 mb-2">Modules:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {course.modules.map((mod, i) => (
                        <li key={i}>{mod}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Enroll Button */}
                  <Button
                    onClick={() => handleEnrollClick(course._id, course.title)}
                    className="mt-auto w-full text-lg font-medium py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
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
      </section>

      {/* ---------------- Gallery Section ---------------- */}
      <section id="gallery" className="py-16 bg-white px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-10">
            Featured Artworks
          </h2>

          {/* Swiper Carousel */}
          <Swiper
            modules={[Autoplay]}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            spaceBetween={20}
            loop={true}
            touchRatio={1.5}
            grabCursor={true}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {artworks.length > 0 ? (
              artworks.map((art) => (
                <SwiperSlide key={art._id}>
                  <Card className="rounded-2xl shadow-md hover:scale-105 transition-transform duration-300 h-full">
                    <CardContent className="p-4">
                      {/* Artwork Image */}
                      <div className="h-48 bg-gray-100 mb-4 rounded-xl overflow-hidden">
                        <img
                          src={art.imageUrl}
                          alt={art.title}
                          className="w-full h-full object-cover"
                          onError={() =>
                            console.error(`Image load failed: ${art.imageUrl}`)
                          }
                        />
                      </div>
                      {/* Artwork Title & Description */}
                      <h3 className="text-xl font-medium">{art.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {art.description}
                      </p>
                    </CardContent>
                  </Card>
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <p className="text-center text-gray-500">
                  No artworks available
                </p>
              </SwiperSlide>
            )}
          </Swiper>
        </div>
      </section>

      {/* ---------------- Why Artistic Vicky Section ---------------- */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-800">
            Why <span className="text-pink-600">Artistic Vicky?</span>
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover what makes Artistic Vicky a unique space for creativity, passion,
            and meaningful artistic expression.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {reasons.map((item, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition duration-300"
              >
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Contact Section ---------------- */}
      <section id="contact" className="py-16 px-4 bg-purple-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6 text-center">
            Connect with Vicky
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {contactLinks.map(({ label, url, display, icon }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md border border-purple-200
                  hover:bg-purple-600 hover:text-white transition"
              >
                <span className="text-2xl">{icon}</span>
                <div>
                  <p className="font-semibold">{label}</p>
                  <p className="text-sm">
                    {display ?? url.replace(/^https?:\/\//, "")}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Auth Modal ---------------- */}
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
