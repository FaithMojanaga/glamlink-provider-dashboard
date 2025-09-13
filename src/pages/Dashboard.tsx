import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";

export default function Dashboard() {
  // Calculate future/current bookings for NavBar
  const [futureCurrentBookingsCount, setFutureCurrentBookingsCount] =
    useState(0);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      import("../api").then(({ default: api }) => {
        api
          .get(`/bookings/provider/${userId}`)
          .then((response) => {
            const bookings = response.data as any[];
            const todayStr = new Date().toISOString().split("T")[0];
            const futureCurrent = bookings.filter((b) => {
              const bookingDateStr = b.date ?? b.time?.split("T")[0] ?? b.time;
              let bookingDateISO = bookingDateStr;
              if (bookingDateStr && bookingDateStr.includes("/")) {
                const [day, month, year] = bookingDateStr.split("/");
                bookingDateISO = `${year}-${month.padStart(
                  2,
                  "0"
                )}-${day.padStart(2, "0")}`;
              }
              return bookingDateISO >= todayStr;
            });
            setFutureCurrentBookingsCount(futureCurrent.length);
          })
          .catch(() => setFutureCurrentBookingsCount(0));
      });
    }
  }, []);

  const [greeting, setGreeting] = useState("");
  const providerName =
    localStorage.getItem("providerName") || "Service Provider";

  // Dynamic greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning!");
    else if (hour < 18) setGreeting("Good afternoon!");
    else setGreeting("Good evening!");
  }, []);

  // Stats
  const [totalServices, setTotalServices] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [todayBookings, setTodayBookings] = useState(0);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      import("../api").then(({ default: api }) => {
        api
          .get(`/services/provider/${userId}`)
          .then((response) => {
            setTotalServices((response.data as any[]).length);
          })
          .catch(() => setTotalServices(0));

        api
          .get(`/bookings/provider/${userId}`)
          .then((response) => {
            const bookings = response.data as any[];
            setTotalBookings(bookings.length);

            const today = new Date().toISOString().split("T")[0];
            const todayCount = bookings.filter((b) => {
              const bookingDate = b.date ?? b.time?.split("T")[0];
              return bookingDate === today;
            }).length;
            setTodayBookings(todayCount);
          })
          .catch(() => {
            setTotalBookings(0);
            setTodayBookings(0);
          });
      });
    }
  }, []);

  // Previous bookings: all except today's
  const [previousBookings, setPreviousBookings] = useState<any[]>([]);
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      import("../api").then(({ default: api }) => {
        api
          .get(`/bookings/provider/${userId}`)
          .then((response) => {
            const bookings = response.data as any[];
            const todayStr = new Date().toISOString().split("T")[0];
            const prev = bookings.filter((b) => {
              if (b.providerId && b.providerId !== userId) return false;
              const bookingDateStr = b.date ?? b.time?.split("T")[0];
              if (!bookingDateStr) return false;
              const bookingDate = new Date(bookingDateStr);
              return bookingDate.toISOString().split("T")[0] < todayStr;
            });
            setPreviousBookings(prev);
          })
          .catch(() => setPreviousBookings([]));
      });
    }
  }, []);

  return (
    <div className="pb-20 p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <img src="/src/assets/logo.png" alt="GlamLink Logo" className="h-10" />
        <button className="text-3xl">☰</button>
      </header>

      {/* Hero */}
      <div className="bg-pink-500 text-white p-10 rounded-2xl shadow mb-6 text-center">
        <h2 className="text-2xl font-extrabold">{greeting}</h2>
        <p className="mt-2 text-lg">Welcome back, {providerName} 👋</p>
        <p className="mt-3 text-sm opacity-90">
          Manage your bookings and services with ease ✨
        </p>
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
          {previousBookings.slice(0, 3).map((b) => {
            let dateStr = b.date;
            let timeStr = b.time;
            if (dateStr && dateStr.includes("/")) {
              const [day, month, year] = dateStr.split("/");
              dateStr = `${year}-${month.padStart(2, "0")}-${day.padStart(
                2,
                "0"
              )}`;
            }
            return (
              <Link
                to="/bookings"
                key={b.id}
                className="flex justify-between items-center bg-white p-3 rounded-xl shadow hover:bg-pink-50 transition"
              >
                <div>
                  <p className="font-medium">{b.client_name ?? b.client}</p>
                  <p className="text-sm text-gray-500">
                    {b.service_name ?? b.service}
                  </p>
                  <p className="text-xs text-gray-400">
                    {dateStr} {timeStr}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      b.status?.toLowerCase() === "confirmed" ||
                      b.status?.toLowerCase() === "complete"
                        ? "bg-green-100 text-green-600"
                        : b.status?.toLowerCase() === "pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {b.status ?? "Pending"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <NavBar bookingsCount={futureCurrentBookingsCount} />
    </div>
  );
}
