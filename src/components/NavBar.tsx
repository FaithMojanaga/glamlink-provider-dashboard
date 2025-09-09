import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function NavBar() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<number>(3); // Example: 3 new notifications

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/"); // redirect to login page
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t flex justify-between items-center px-4 py-2">
      {/*  Navigation Links */}
      <div className="flex justify-around flex-1">
        <Link to="/services" className="text-pink-600 flex flex-col items-center text-sm">
          💅 <span>Services</span>
        </Link>
        <Link to="/bookings" className="text-pink-600 flex flex-col items-center text-sm relative">
          📅 <span>Bookings</span>
          {notifications > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
              {notifications}
            </span>
          )}
        </Link>
        <Link to="/profile" className="text-pink-600 flex flex-col items-center text-sm">
          👤 <span>Profile</span>
        </Link>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="text-white bg-pink-600 px-3 py-1 rounded hover:bg-pink-700 text-sm"
      >
        Logout
      </button>
    </nav>
  );
}
