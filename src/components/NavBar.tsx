import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function NavBar() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<number>(3); 

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/"); // redirect to login page
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t flex items-center justify-between px-4 py-2 shadow">
      {/* Navigation Links */}
      <div className="flex justify-around flex-1">
        <Link
          to="/dashboard"
          className="text-pink-600 flex flex-col items-center text-sm"
          aria-label="Dashboard"
        >
          🏠 <span>Dashboard</span>
        </Link>

        <Link
          to="/services"
          className="text-pink-600 flex flex-col items-center text-sm"
          aria-label="Services"
        >
          💅 <span>Services</span>
        </Link>

        <Link
          to="/bookings"
          className="text-pink-600 flex flex-col items-center text-sm relative"
          aria-label="Bookings"
        >
          📅 <span>Bookings</span>
          {notifications > 0 && (
            <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
              {notifications}
            </span>
          )}
        </Link>

        <Link
          to="/profile"
          className="text-pink-600 flex flex-col items-center text-sm"
          aria-label="Profile"
        >
          👤 <span>Profile</span>
        </Link>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="ml-3 text-white bg-pink-600 px-3 py-1 rounded hover:bg-pink-700 text-sm"
        aria-label="Logout"
      >
        Logout
      </button>
    </nav>
  );
}
