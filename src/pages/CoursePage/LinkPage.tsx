
// const contactLinks = [
//   { label: "Website", url: "https://artisticvicky.netlify.app/", icon: "🌐" },
//   { label: "WhatsApp", url: "https://wa.me/9226221871", display: "9226221871", icon: "📱" },
//   { label: "E-mail", url: "mailto:vikkitembhurne358@gmail.com", display: "vikkitembhurne358@gmail.com", icon: "✉️" },
//   { label: "WhatsApp Group", url: "https://chat.whatsapp.com/LYEPtRmEj9L...", icon: "👥" },
//   { label: "Instagram", url: "https://www.instagram.com/artistic.vi...", icon: "📸" },
// ];

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

export default function LinksPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-extrabold text-purple-700 mb-10 text-center">
        Important Links
      </h1>

      {/* Contact & Social Section */}
      {/* <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-6 border-b-4 border-purple-600 inline-block pb-2">
          Contact & Social
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {contactLinks.map(({ label, url, display, icon }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex items-center gap-4 p-5 bg-white rounded-lg shadow-lg border border-purple-200
                transition-colors duration-300
                hover:bg-purple-600
                hover:text-white
                hover:shadow-xl
                hover:border-purple-700
              "
            >
              <div className="text-4xl">{icon}</div>
              <div>
                <p className="text-lg font-semibold">{label}</p>
                <p className="text-gray-600 group-hover:text-white">
                  {display ?? url.replace(/^https?:\/\//, "")}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section> */}

      {/* Products Section */}
      <section>
        <h2 className="text-3xl font-semibold mb-6 border-b-4 border-purple-600 pb-2 w-fit mx-auto text-center">
  Special Offers on Art Materials
</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {productLinks.map(({ label, url }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                block p-4 bg-white rounded-lg shadow-md border border-purple-200
                text-purple-700 font-medium text-center
                transition-colors duration-300
                hover:bg-purple-600
                hover:text-white
                hover:shadow-lg
                hover:border-purple-700
              "
            >
              {label}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
