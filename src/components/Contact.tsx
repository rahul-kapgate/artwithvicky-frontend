import { Mail, Instagram, Youtube, Facebook } from "lucide-react";

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-purple-600 mb-6 text-center">
        Contact Us
      </h1>

      <p className="text-gray-600 text-center mb-12">
        Feel free to reach out through any of the following platforms:
      </p>

      <div className="space-y-6 text-center">
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
  );
}
