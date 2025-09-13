import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import api from "../api";

type Booking = {
  id: number;
  service_name: string;
  client_name: string;
  status?: string;
  time: string;
  provider_id: string | number;
  newDate?: string;
  newTime?: string;
};

export default function Bookings() {
  const [greeting, setGreeting] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeService, setActiveService] = useState<string | null>(null);
  const [rescheduleBookingId, setRescheduleBookingId] = useState<number | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  // Dynamic greeting + fetch bookings
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning!");
    else if (hour < 18) setGreeting("Good afternoon!");
    else setGreeting("Good evening!");

    const userId = localStorage.getItem("userId");
    if (userId) {
      api
        .get<Booking[]>(`/bookings/provider/${userId}`)
        .then((response) => {
          const filtered = response.data.filter(
            (b) => b.provider_id?.toString() === userId.toString()
          );
          setBookings(filtered);
          // default to first service tab
          if (filtered.length > 0) {
            setActiveService(filtered[0].service_name);
          }
        })
        .catch(() => setBookings([]));
    }
  }, []);

  // Get today's date string
  const todayStr = new Date().toISOString().split("T")[0];
  const futureCurrentBookings = bookings.filter((b) => {
    const bookingDateStr = b.time?.split("T")[0] || b.time;
    let bookingDateISO = bookingDateStr;
    if (bookingDateStr && bookingDateStr.includes("/")) {
      const [day, month, year] = bookingDateStr.split("/");
      bookingDateISO = `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}`;
    }
    return bookingDateISO >= todayStr;
  });

  const services = Array.from(new Set(bookings.map((b) => b.service_name)));

  // Handle booking actions
  const fetchBookings = async () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      try {
        const response = await api.get<Booking[]>(
          `/bookings/provider/${userId}`
        );
        setBookings(response.data);
      } catch {
        setBookings([]);
      }
    }
  };

  const handleAction = async (
    id: number,
    action: "Confirmed" | "Rejected" | "Reschedule" | "Complete" | "Cancel"
  ) => {
    if (!id && id !== 0) return;
    setErrorMsg("");
    setSuccessMsg("");
    if (action === "Reschedule") {
      setRescheduleBookingId(id);
    } else {
      setLoadingId(id);
      try {
        await api.patch(`/bookings/${id}/status`, {
          status: action.toLowerCase(),
        });
        setSuccessMsg(`Booking status updated to ${action}`);
        await fetchBookings();
      } catch (error: any) {
        setErrorMsg(
          error?.response?.data?.message || "Failed to update booking status."
        );
      } finally {
        setLoadingId(null);
      }
    }
  };

  const handleSaveReschedule = async () => {
    if (!selectedDate || !selectedTime || rescheduleBookingId === null) return;
    setErrorMsg("");
    setSuccessMsg("");
    setLoadingId(rescheduleBookingId);
    try {
      const newDateTime = new Date(
        `${selectedDate}T${selectedTime}`
      ).toISOString();
      await api.patch(`/bookings/${rescheduleBookingId}/reschedule`, {
        time: newDateTime,
      });
      setSuccessMsg("Booking rescheduled successfully.");
      setRescheduleBookingId(null);
      setSelectedDate("");
      setSelectedTime("");
      await fetchBookings();
    } catch (error: any) {
      setErrorMsg(
        error?.response?.data?.message || "Failed to reschedule booking."
      );
    } finally {
      setLoadingId(null);
    }
  };

  const handleCancelReschedule = () => {
    setRescheduleBookingId(null);
    setSelectedDate("");
    setSelectedTime("");
  };

  const statusColor = (status?: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "":
        return "bg-red-100 text-red-800";
      case "Rescheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="pb-16 p-4">
      {/* Success/Error/Loading messages */}
      {successMsg && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">
          {errorMsg}
        </div>
      )}
      {!successMsg && !errorMsg && loadingId !== null && (
        <div className="mb-4 p-2 bg-blue-100 text-blue-800 rounded">
          Processing booking update...
        </div>
      )}

      {/* Greeting */}
  <div className="mb-6 p-4 bg-pink-500 rounded shadow text-white">
        <h2 className="text-lg font-bold">
          {greeting} Welcome to your GlamLink!
        </h2>
        <p className="text-gray-700">
          Select a service tab to see bookings and manage them.
        </p>
      </div>

      {/* Tabs */}
      <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400 mb-4">
        {services.map((service) => (
          <li key={service} className="me-2">
            <button
              onClick={() => setActiveService(service)}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeService === service
                  ? "bg-pink-600 text-white"
                  : "bg-pink-100 text-pink-700 hover:bg-pink-200 hover:text-pink-900"
              }`}
            >
              {service}
            </button>
          </li>
        ))}
      </ul>

      {/* Active tab bookings */}
      <div className="flex flex-col gap-2">
        {bookings
          .filter((b) => b.service_name === activeService)
          .map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 hover:bg-pink-50 transition"
            >
              <div className="flex-1">
                <div className="font-bold text-lg text-pink-600 mb-1">{b.service_name}</div>
                <div className="text-gray-700 mb-1">
                  <span className="font-medium">Client:</span> {b.client_name}
                </div>
                <div className="text-gray-500 mb-1">
                  <span className="font-medium">Date/Time:</span> {new Date(b.time).toLocaleString()}
                </div>
                <div className="mb-1">
                  <span className="font-medium">Status:</span>
                  {b.status && (
                    <span
                      className={`ml-2 px-2 py-0.5 rounded text-sm ${statusColor(b.status)}`}
                    >
                      {b.status}
                      {b.newDate && b.newTime ? `: ${b.newDate} ${b.newTime}` : ""}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 md:flex-col md:items-end">
                <button
                  className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 font-medium"
                  onClick={() => handleAction(b.id, "Confirmed")}
                  disabled={loadingId === b.id || b.status?.toLowerCase() === "confirmed"}
                >
                  {loadingId === b.id ? "Processing..." : "Confirm"}
                </button>
                <button
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 font-medium"
                  onClick={() => handleAction(b.id, "Reschedule")}
                  disabled={loadingId === b.id || b.status?.toLowerCase() === "confirmed"}
                >
                  {loadingId === b.id ? "Processing..." : "Reschedule"}
                </button>
                <button
                  className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 font-medium"
                  onClick={() => handleAction(b.id, "Rejected")}
                  disabled={loadingId === b.id || b.status?.toLowerCase() === "confirmed"}
                >
                  {loadingId === b.id ? "Processing..." : "Reject"}
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Reschedule Modal */}
      {rescheduleBookingId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-80">
            <h3 className="text-lg font-bold mb-4">Reschedule Booking</h3>
            <input
              type="date"
              className="border p-2 rounded w-full mb-4"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <input
              type="time"
              className="border p-2 rounded w-full mb-4"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancelReschedule}
                className="px-3 py-1 rounded border hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReschedule}
                className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <NavBar bookingsCount={futureCurrentBookings.length} />
    </div>
  );
}
