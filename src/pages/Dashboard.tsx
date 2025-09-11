import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { bookings } from "../data/bookings";
import { services } from "../data/services";

export default function Dashboard() {
  const [greeting, setGreeting] = useState("");
  const serviceProvider = "Service Provider Name";

  // Dynamic greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning!");
    else if (hour < 18) setGreeting("Good afternoon!");
    else setGreeting("Good evening!");
  }, []);

  // Stats
  const totalServices = services.length;
  const totalBookings = bookings.length;
  const today = new Date().toISOString().split("T")[0];
  const todayBookings = bookings.filter((b) => b.date === today).length;

  return (
    <div className="pb-20 p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <img src="/src/assets/logo.png" alt="GlamLink Logo" className="h-10" />
        <button className="text-3xl">☰</button>
      </header>

      {/* Hero */}
      <div className="bg-pink-500 text-white p-6 rounded-2xl shadow mb-6 text-center">
        <h2 className="text-xl font-bold">{greeting}</h2>
        <p className="mt-1">Welcome back, {serviceProvider} 👋</p>
        <div className="mt-4">
          <img
            src="https://via.placeholder.com/120"
            alt="Service Provider"
            className="w-28 h-28 rounded-full border-4 border-white mx-auto"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <h3 className="text-lg font-bold mb-3">Your Stats</h3>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-pink-100 p-4 rounded-xl text-center shadow">
          <p className="text-2xl font-bold">{totalServices}</p>
          <p className="text-sm">All Services Offered</p>
        </div>
        <div className="bg-pink-100 p-4 rounded-xl text-center shadow">
          <p className="text-2xl font-bold">{totalBookings}</p>
          <p className="text-sm">All Bookings</p>
        </div>
        <div className="bg-pink-100 p-4 rounded-xl text-center shadow">
          <p className="text-2xl font-bold">{todayBookings}</p>
          <p className="text-sm">Bookings Today</p>
        </div>
        <div className="bg-pink-100 p-4 rounded-xl text-center shadow">
          <p className="text-2xl font-bold">{totalBookings - todayBookings}</p>
          <p className="text-sm">Other Bookings</p>
        </div>
      </div>

      {/* Previous Bookings */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold">Previous Bookings</h3>
          <button className="text-pink-500 text-sm">See All →</button>
        </div>

        <div className="flex flex-col gap-2">
          {bookings.slice(0, 3).map((b) => (
            <Link
              to="/bookings"
              key={b.id}
              className="flex justify-between items-center bg-white p-3 rounded-xl shadow hover:bg-pink-50 transition"
            >
              <div>
                <p className="font-medium">{b.client}</p>
                <p className="text-sm text-gray-500">{b.service}</p>
              </div>
              <div className="text-right">
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    b.status === "Confirmed" || b.status === "Complete"
                      ? "bg-green-100 text-green-600"
                      : b.status === "Pending"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {b.status ?? "Pending"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <NavBar />
    </div>
  );
}
