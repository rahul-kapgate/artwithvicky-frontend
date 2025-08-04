// Home.tsx

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/autoplay";
import axios from "axios";
import { useEffect, useState } from "react";
import { Autoplay } from "swiper/modules";

interface Artwork {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
}

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
    url: "https://chat.whatsapp.com/LYEPtRmEj9L2CbbOZCaERz",
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

const productLinks = [
  { label: "Stadler Graphite Pencils", url: "https://amzn.to/45uKJ2E" },
  { label: "Kneaded Eraser", url: "https://amzn.to/4eeJGWY" },
  { label: "Camel Artist Watercolor Tube Set", url: "https://amzn.to/404SyJ1" },
  { label: "Colour Mixing Pallet", url: "https://amzn.to/4ndwKVb" },
  { label: "Camel Brush Set", url: "https://amzn.to/4lbBCbG" },
  { label: "Poster Colours", url: "https://amzn.to/44nZH9D" },
  { label: "Mono Zero Eraser", url: "https://amzn.to/4l2cSTB" },
  { label: "White Gelly Roll Pen", url: "https://amzn.to/40ddSvI" },
  { label: "Electric Eraser", url: "https://amzn.to/3GakBQc" },
  { label: "Brustro Artist Drawing Paper", url: "https://amzn.to/3G6SxgK" },
  { label: "Brustro Drawing Paper 200gsm", url: "https://amzn.to/4kQjsMK" },
  { label: "Camelin Charcoal Pencils", url: "https://amzn.to/3ZGH2Dp" },
  { label: "Sand Paper", url: "https://amzn.to/45vKAMt" },
  { label: "Charcoal Powder", url: "https://amzn.to/3HTGd3Z" },
  { label: "Pencil Extender", url: "https://amzn.to/44aOt8x" },
  { label: "Fixative Spray", url: "https://amzn.to/4lzl0uO" },
  { label: "Think 3d Book", url: "https://amzn.to/3Tdqv6f" },
  { label: "A3 Drawing Book", url: "https://amzn.to/3I4YPhC" },
  { label: "Pen Tab & Laptop", url: "https://amzn.to/3TzrDkF" },
];

export default function Home() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get("https://artwithvicky-backend.onrender.com/api/images/get-images");
      setArtworks(response.data.data);
    } catch (error) {
      console.error("Error fetching artworks:", error);
    }
  };

  return (
    <div className="w-full h-full text-gray-800 scroll-smooth">

      {/* Hero */}
      <section className="w-full min-h-screen bg-gradient-to-r from-purple-100 via-purple-50 to-purple-100 text-center py-20 px-4">
  <div className="max-w-4xl mx-auto">
    <h1 className=" text-8xl font-extrabold tracking-tight leading-tight mb-6 ">
      Welcome to{" "}
      <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 bg-clip-text text-transparent font-serif italic drop-shadow-md">
        Artistic Vicky
      </span>
    </h1>
    <p className="text-xl text-gray-700 font-medium italic mb-8">
      Discover colors, creativity, and inspiration through the eyes of Vicky.
    </p>
   <button type="button" className="button-86">
  🎨 Explore Gallery
</button>


  </div>
</section>


      {/* Gallery */}
      <section id="gallery" className="w-full min-h-screen bg-gradient-to-r from-purple-100 via-purple-50 to-purple-100 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-10">Featured Artworks</h2>
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 2000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            mousewheel={{ forceToAxis: true }}
            spaceBetween={20}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            loop={true}
            touchRatio={1.5}
            grabCursor={true}
          >
            {artworks.length > 0 ? (
              artworks.map((art, idx) => (
                <SwiperSlide key={idx}>
                  <Card className="rounded-2xl shadow-md hover:scale-105 transition-transform duration-300 h-full">
                    <CardContent className="p-4">
                      <div className="h-48 bg-gray-100 mb-4 rounded-xl overflow-hidden">
                        <img
                          src={art.imageUrl}
                          alt={art.title}
                          className="w-full h-full object-cover"
                          onError={() => console.error(`Image load failed: ${art.imageUrl}`)}
                        />
                      </div>
                      <h3 className="text-xl font-medium">{art.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{art.description}</p>
                    </CardContent>
                  </Card>
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <p className="text-center text-gray-500">No artworks available</p>
              </SwiperSlide>
            )}
          </Swiper>
        </div>
      </section>

      {/* Courses */}
      {/* <section id="courses" className="w-full min-h-screen bg-gradient-to-r from-purple-100 via-purple-50 to-purple-100 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4">Our Courses</h2>
          <p className="text-gray-700 text-lg mb-6">
            Unlock your creativity and build your skills with our exclusive art courses.
          </p>
          <Link
            to="/courses"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white text-lg font-medium px-6 py-3 rounded-full transition duration-300"
          >
            View Courses
          </Link>
        </div>
      </section> */}

      <section
  id="courses"
  className="relative w-full min-h-screen bg-gradient-to-r from-purple-100 via-white to-purple-100 py-20 px-4 overflow-hidden"
>
  {/* Decorative blurred circles */}
  <div className="absolute top-0 left-0 w-40 h-40 bg-purple-300 opacity-20 rounded-full blur-3xl animate-pulse"></div>
  <div className="absolute bottom-10 right-0 w-60 h-60 bg-purple-400 opacity-20 rounded-full blur-3xl animate-pulse"></div>

  <div className="max-w-5xl mx-auto text-center relative z-10">
    <h2 className="text-4xl font-extrabold mb-4 text-gray-800">
      <span className="text-purple-600">Ignite</span> Your Creativity
    </h2>
    <p className="text-gray-600 text-lg mb-10">
      Learn from expert artists and explore your passion with our hand-picked art courses.
    </p>

    {/* Featured Courses */}
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      <div className="bg-white shadow-xl rounded-xl p-6 hover:scale-105 transition-transform duration-300 border">
        <h3 className="text-xl font-semibold text-purple-700 mb-2">Watercolor Basics</h3>
        <p className="text-gray-600">Perfect for beginners. Learn brush control, blending, and color theory.</p>
      </div>
      <div className="bg-white shadow-xl rounded-xl p-6 hover:scale-105 transition-transform duration-300 border">
        <h3 className="text-xl font-semibold text-purple-700 mb-2">Portrait Drawing</h3>
        <p className="text-gray-600">Master facial proportions, shading, and expressiveness in your sketches.</p>
      </div>
    </div>

    {/* Call to Action Button */}
    <Link to="/courses" className="button-86" role="button">
  Explore All Courses
</Link>

  </div>
</section>


      {/* About Us */}
      <section id="about" className="w-full min-h-screen bg-gradient-to-r from-purple-100 via-purple-50 to-purple-100 relative overflow-hidden py-20 px-6">
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-purple-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-purple-400 rounded-full opacity-30 animate-pulse animation-delay-2000"></div>

        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-12 relative z-10">
          <h2 className="text-4xl font-extrabold mb-6 flex items-center justify-center gap-3 text-purple-700">
            About Us
          </h2>
          <p className="text-gray-700 text-lg mb-6 leading-relaxed tracking-wide">
            Art Inspiration & BFA Exam Success – Discover a world of artistic inspiration through captivating videos on drawing, painting, digital art, and more.
            Simultaneously, navigate your Bachelor of Fine Arts journey with our comprehensive exam guides, study strategies, and important updates.
            Join us now to fuel your creativity and conquer your BFA exams! <span className="inline-block text-purple-600 text-2xl">🏆</span>
          </p>
          <div className="flex justify-center">
            <Badge variant="outline" className="text-purple-600 border-purple-500 text-sm font-semibold px-4 py-2 text-center">
              Based in India · Available for commissions
            </Badge>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="w-full min-h-screen bg-gradient-to-r from-purple-100 via-purple-50 to-purple-100 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6 text-center">Connect with Vicky</h2>
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
                  <p className="text-sm">{display ?? url.replace(/^https?:\/\//, "")}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="links" className="w-full min-h-screen bg-gradient-to-r from-purple-100 via-purple-50 to-purple-100 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6 text-center">Recommended Art Materials</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {productLinks.map(({ label, url }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-white rounded-lg shadow-md border border-purple-200 text-purple-700
                  hover:bg-purple-600 hover:text-white transition text-center font-medium"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
