import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {  Mail, Instagram, Youtube, Facebook } from "lucide-react";
import { Link } from "react-router-dom"; // ⬅️ Make sure this is at the top
import { Swiper, SwiperSlide } from "swiper/react";
//@ts-ignore
import "swiper/css";
//@ts-ignore
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";



const artworks = [
  {
    title: "Sunset Bloom",
    description: "",
    imageUrl: "/images/038b8e7fd25d78482c642ccb405e1047.jpg",
  },
  {
    title: "Leaf 2D Design – Split Complementary Colour Scheme",
    description: "",
    imageUrl: "/images/1878421155e7a3ff9d869a3d2bb756a1.jpg",
  },
  {
    title: "Cup, Bottle & Fruit – Object Drawing",
    description: "",
    imageUrl: "/images/20240417_164034.jpg",
  },
  {
    title: "Coconut – ObjectDrawing",
    description: "",
    imageUrl: "/images/20250409_132807.jpg",
  },
  {
    title: "Dreamy Dusk",
    description: "",
    imageUrl: "/images/20250603_144839.jpg",
  },
  {
    title: "Football Playing – Memory Drawing",
    description: "",
    imageUrl: "/images/26080428a75c521c530cf451fbea58f6.jpg",
  },
  {
    title: "Geometrical Shapes – 2D Design",
    description: "",
    imageUrl: "/images/2c05e915422d5626f0e272caaaaf3aee.jpg",
  },
  {
    title: "Bus Stand Scene – Memory Drawing",
    description: "",
    imageUrl: "/images/61837c25e589da6e929c249c111b81ec.jpg",
  },
  {
    title: "Art Tools – 2D Design",
    description: "",
    imageUrl: "/images/7281da70f2432214f51175d35a3db60f.jpg",
  },
  {
    title: "Leaf – Memory Drawing with Split Complementary Colour Scheme",
    description: "",
    imageUrl: "/images/IMG-20250506-WA0030.jpg",
  },
  {
    title: "Musical Instruments – 2D Design",
    description: "",
    imageUrl: "/images/IMG-20250506-WA0033.jpg",
  },
  {
    title: "Velvet Night",
    description: "",
    imageUrl: "/images/IMG_20241223_090922_733.jpg",
  },
  {
    title: "Market Scene – Memory Drawing",
    description: "",
    imageUrl: "/images/IMG_20241223_090925_096.jpg",
  },
  {
    title: "Pani Puri Eating Family – Memory Drawing",
    description: "",
    imageUrl: "/images/IMG_20241223_090927_647.jpg",
  },
  {
    title: "Market Scene – Memory Drawing",
    description: "",
    imageUrl: "/images/IMG_20241223_090929_603.jpg",
  },
  {
    title: "Fish Market Scene – Memory Drawing",
    description: "",
    imageUrl: "/images/IMG_20241223_090931_702.jpg",
  },
  {
    title: "Village Scene – Memory Drawing",
    description: "",
    imageUrl: "/images/IMG_20241223_090934_709.jpg",
  },
  {
    title: "Firefly Garden",
    description: "",
    imageUrl: "/images/IMG_20250403_080603_783.jpg",
  },
  {
    title: "Celestial Dreams",
    description: "",
    imageUrl: "/images/IMG_20250403_080642_504.jpg",
  },
  {
    title: "Serenity Shore",
    description: "",
    imageUrl: "/images/IMG_20250403_083158_726.jpg",
  },
  {
    title: "Art Materials – 2D Design",
    description: "",
    imageUrl: "/images/b4893c380785578e08c308239538ff7f.jpg",
  },
  {
    title: "Family Picnic – Memory Drawing",
    description: "",
    imageUrl: "/images/bfb83b4a9dfc73c8e6f935888a18cda6.jpg",
  },
  {
    title: "Pastel Pathways",
    description: "",
    imageUrl: "/images/e5e055325b4b74e1d79756143c15b3c1.jpg",
  },
  {
    title: "Flowers and Leaf – 2D Design",
    description: "",
    imageUrl: "/images/f81570e57f8e33072ab04ddd8aebc6c2.jpg",
  },
  {
    title: "Beach Scene – Memory Drawing",
    description: "",
    imageUrl: "/images/fbf2464895b0a9ec3059b8ca99b7e719.jpg",
  },
];



export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white text-gray-800 scroll-smooth">
      {/* Hero Section */}
      <section id="hero" className="text-center py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-purple-500 via-purple-600 to-purple-800 bg-clip-text text-transparent">
  Artistic Vicky
</span>

          </h1>

          <p className="text-lg text-gray-600 mb-6">
            Discover colors, creativity, and inspiration through the eyes of
            Vicky.
          </p>
          <a href="#gallery">
            <Button className="text-lg px-6 py-4">Explore Gallery</Button>
          </a>
        </div>
      </section>

      {/* Featured Artworks */}
      <section id="gallery" className="py-16 bg-white px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-10">
            Featured Artworks
          </h2>
          <Swiper
            modules={[Autoplay]}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            spaceBetween={20}
            breakpoints={{
              0: { slidesPerView: 1 }, // Mobile
              640: { slidesPerView: 2 }, // Small tablets
              1024: { slidesPerView: 3 }, // Laptops and larger
            }}
            loop={true}
          >
            {artworks.map((art, idx) => (
              <SwiperSlide key={idx}>
                <Card className="rounded-2xl shadow-md hover:scale-105 transition-transform duration-300 h-full">
                  <CardContent className="p-4">
                    <div className="h-48 bg-gray-100 mb-4 rounded-xl overflow-hidden">
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-medium">{art.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {art.description}
                    </p>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-20 bg-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4">Our Courses</h2>
          <p className="text-gray-700 text-lg mb-6">
            Unlock your creativity and build your skills with our exclusive art
            courses.
          </p>
          <Link
            to="/courses"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white text-lg font-medium px-6 py-3 rounded-full transition duration-300"
          >
            View Courses
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-purple-50 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4">About Us</h2>
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
            className="text-purple-600 border-purple-500 text-sm"
          >
            Based in India · Available for commissions
          </Badge>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4 text-purple-600">
            Contact Us
          </h2>
          <p className="text-gray-600 mb-10">
            Feel free to reach out through any of the following platforms:
          </p>
          <div className="space-y-6">
            {/* WhatsApp */}
            <a
              href="https://wa.me/919226221871"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.52 3.48a12.07 12.07 0 0 0-17.04 0 12.03 12.03 0 0 0-2.79 12.68L.01 23l6.98-1.82a12.07 12.07 0 0 0 6.52 1.82 12.03 12.03 0 0 0 8.5-3.52 12.07 12.07 0 0 0 0-17.04zm-8.48 17.52c-1.96 0-3.87-.52-5.54-1.5l-.4-.23-4.15 1.08 1.11-4.05-.26-.42a9.93 9.93 0 0 1 1.56-12.37 9.95 9.95 0 0 1 14.08 0 9.93 9.93 0 0 1 0 14.07 9.95 9.95 0 0 1-6.4 2.42zm5.63-7.5c-.31-.15-1.84-.91-2.13-1.01-.29-.11-.5-.15-.7.15s-.8 1.01-.98 1.22c-.18.2-.36.22-.67.07-.31-.15-1.31-.48-2.5-1.52a9.4 9.4 0 0 1-1.74-2.15c-.18-.31-.02-.48.13-.63.13-.13.31-.34.47-.52.15-.18.2-.31.31-.52.1-.2.05-.38-.02-.53-.07-.15-.7-1.68-.96-2.3-.25-.6-.5-.52-.7-.53l-.6-.01a1.15 1.15 0 0 0-.84.39 3.52 3.52 0 0 0-1.1 2.63c0 1.54 1.11 3.03 1.26 3.24.15.2 2.2 3.37 5.35 4.72.75.33 1.33.53 1.79.67.75.24 1.44.2 1.98.12.6-.09 1.84-.75 2.1-1.47.26-.73.26-1.36.18-1.5-.07-.14-.27-.22-.57-.37z" />
              </svg>
              <span>Chat on WhatsApp</span>
            </a>

            {/* Email */}
            <a
              href="mailto:vikkitembhurne358@gmail.com"
              className="flex items-center justify-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors duration-200"
            >
              <Mail className="w-5 h-5" />
              <span>vikkitembhurne358@gmail.com</span>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/artistic.vicky/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors duration-200"
            >
              <Instagram className="w-5 h-5" />
              <span>@artistic.vicky</span>
            </a>

            {/* YouTube */}
            <a
              href="https://www.youtube.com/@ArtisticVicky"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors duration-200"
            >
              <Youtube className="w-5 h-5" />
              <span>@ArtisticVicky</span>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/mayur.tembhurne.148"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors duration-200"
            >
              <Facebook className="w-5 h-5" />
              <span>Vicky Tembhurne</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
