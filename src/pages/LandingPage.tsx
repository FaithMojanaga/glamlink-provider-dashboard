import { Link } from "react-router-dom";
import HeroBackground from "../assets/bg.png"; 

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow z-10 relative">
        <img src="/src/assets/logo.png" alt="GlamLink Logo" className="h-10" />
        <nav className="flex space-x-6">
          <a href="#features" className="text-gray-700 hover:text-pink-600">
            Features
          </a>
          <a href="#about" className="text-gray-700 hover:text-pink-600">
            About
          </a>
          <Link
            to="/login"
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
          >
            Sign In
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 relative flex items-center justify-center text-center px-6 py-24">
        {/* Hero Image */}
        <img
          src={HeroBackground}
          alt="GlamLink Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60"></div>

        {/* Text container */}
        <div className="relative z-10 max-w-3xl bg-black/40 rounded-lg p-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            GlamLink connects <br />
            <span className="text-pink-400">beauty service providers to customers effortlessly</span>
          </h1>

          <h2 className="text-lg md:text-xl text-white mb-8">
            From Spas, Salons, and many other beauty services, we cater for all. 
            Our WhatsApp-based booking tool streamlines appointments and payments for all types of beauty services, 
            allowing customers to view and choose from multiple providers in their area.
          </h2>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/login"
              className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 shadow"
            >
              Get Started
            </Link>
            <a
              href="#features"
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-16 px-6 bg-white grid md:grid-cols-3 gap-8 text-center"
      >
        <div className="p-6 rounded-xl shadow bg-pink-50">
          <h3 className="font-bold text-xl mb-2">📅 Easy Bookings</h3>
          <p className="text-gray-600">
            Manage and confirm client appointments with just a few clicks.
          </p>
        </div>
        <div className="p-6 rounded-xl shadow bg-pink-50">
          <h3 className="font-bold text-xl mb-2">📊 Smart Dashboard</h3>
          <p className="text-gray-600">
            Get insights into your services, bookings, and client activity.
          </p>
        </div>
        <div className="p-6 rounded-xl shadow bg-pink-50">
          <h3 className="font-bold text-xl mb-2">💬 Stay Connected</h3>
          <p className="text-gray-600">
            Chat with clients directly via WhatsApp and keep them engaged.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-6 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">About GlamLink</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          GlamLink is built for beauty service providers to streamline client
          bookings, manage services, and grow their business. Whether you’re an
          independent stylist or a salon, GlamLink is your partner for success.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-white py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} GlamLink. All rights reserved.
      </footer>

      {/* Floating WhatsApp Button */}
      <a
       href="https://wa.me/15551678918"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 rounded-full shadow-lg p-4 hover:bg-green-600 transition animate-bounce"
        aria-label="Chat on WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          fill="currentColor"
          className="w-6 h-6 text-white"
        >
          <path d="M16.027 3C9.384 3 4 8.384 4 15.027c0 2.648.77 5.08 2.078 7.137L4 29l7.078-2.055A11.974 11.974 0 0 0 16.027 27C22.67 27 28 21.616 28 14.973 28 8.33 22.67 3 16.027 3zm-.002 22c-2.086 0-4.07-.576-5.805-1.668l-.414-.248-4.195 1.217 1.254-4.086-.27-.422A10.963 10.963 0 0 1 5 15.027C5 9.485 9.485 5 15.027 5 20.57 5 25 9.485 25 15.027 25 20.57 20.57 25 15.027 25zm5.518-7.355c-.303-.15-1.793-.883-2.07-.984-.277-.102-.48-.15-.684.15-.203.297-.785.983-.963 1.184-.176.201-.352.227-.654.076-.303-.15-1.277-.471-2.43-1.502-.898-.801-1.504-1.789-1.68-2.094-.176-.303-.018-.467.133-.617.137-.135.303-.352.453-.527.15-.176.201-.297.303-.5.1-.203.05-.377-.025-.527-.075-.15-.684-1.652-.936-2.27-.246-.592-.496-.51-.684-.52-.176-.008-.377-.01-.578-.01-.201 0-.527.076-.803.377-.277.303-1.055 1.031-1.055 2.512s1.08 2.92 1.23 3.127c.15.201 2.123 3.246 5.152 4.551.719.311 1.281.496 1.719.635.719.229 1.371.197 1.887.119.576-.086 1.793-.73 2.047-1.436.254-.707.254-1.312.178-1.436-.074-.127-.277-.203-.58-.354z" />
        </svg>
      </a>
    </div>
  );
}
