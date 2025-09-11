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
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [greeting, setGreeting] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rescheduleBookingId, setRescheduleBookingId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  // Dynamic greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning!");
    else if (hour < 18) setGreeting("Good afternoon!");
    else setGreeting("Good evening!");

    // Fetch bookings for logged-in provider
    const userId = localStorage.getItem("userId");
    if (userId) {
      api.get<Booking[]>(`/bookings/provider/${userId}`)
        .then((response) => {
          setBookings(response.data);
        })
        .catch(() => {
          setBookings([]);
        });
    }
  }, []);

  const services = Array.from(new Set(bookings.map((b) => b.service_name)));

  const toggleService = (service: string) => {
    setExpandedService(expandedService === service ? null : service);
  };



  // Handle booking actions with correct API endpoints
  const fetchBookings = async () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      try {
        const response = await api.get<Booking[]>(`/bookings/provider/${userId}`);
        setBookings(response.data);
      } catch {
        setBookings([]);
      }
    }
  };

  const handleAction = async (id: number, action: "Confirmed" | "Rejected" | "Reschedule") => {
    if (!id && id !== 0) return;
    setErrorMsg("");
    setSuccessMsg("");
    if (action === "Reschedule") {
      setRescheduleBookingId(id);
    } else {
      setLoadingId(id);
      try {
        const res = await api.put(`/bookings/${id}/status`, { status: action.toLowerCase() });
        console.log("Status update response:", res.data);
        setSuccessMsg(`Booking status updated to ${action}`);
        await fetchBookings();
      } catch (error: any) {
        setErrorMsg(error?.response?.data?.message || "Failed to update booking status.");
      } finally {
        setLoadingId(null);
      }
    }
  } 

  // Save rescheduled booking with correct API endpoint
  const handleSaveReschedule = async () => {
    if (!selectedDate || !selectedTime || rescheduleBookingId === null) return;
    setErrorMsg("");
    setSuccessMsg("");
    setLoadingId(rescheduleBookingId);
    try {
      const newDateTime = new Date(`${selectedDate}T${selectedTime}`).toISOString();
      const res = await api.patch(`/bookings/${rescheduleBookingId}/reschedule`, {
        time: newDateTime,
      });
      console.log("Reschedule response:", res.data);
      setSuccessMsg("Booking rescheduled successfully.");
      setRescheduleBookingId(null);
      setSelectedDate("");
      setSelectedTime("");
      await fetchBookings();
    } catch (error: any) {
      setErrorMsg(error?.response?.data?.message || "Failed to reschedule booking.");
    } finally {
      setLoadingId(null);
    }
  } 

  const handleCancelReschedule = () => {
    setRescheduleBookingId(null);
    setSelectedDate("");
    setSelectedTime("");
  };

  // Get color based on status
  const statusColor = (status?: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Rescheduled":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="pb-16 p-4">
      {/* Success/Error messages */}
      {successMsg && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">{successMsg}</div>
      )}
      {errorMsg && (
        <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">{errorMsg}</div>
      )}
      {/* Greeting */}
      <div className="mb-6 p-4 bg-green-100 rounded shadow">
        <h2 className="text-lg font-bold">{greeting} Welcome to your GlamLink!</h2>
        <p className="text-gray-700">
          Tap on a service to see all bookings and manage them.
        </p>
      </div>

      {/* Bookings */}
      <div className="flex flex-col gap-2">
        {services.map((service) => (
          <div key={`service-${service}`} className="bg-white rounded shadow">
            <button
              onClick={() => toggleService(service)}
              className="w-full text-left p-3 font-medium hover:bg-gray-100 flex justify-between items-center"
            >
              {service}
              <span>{expandedService === service ? "▲" : "▼"}</span>
            </button>

            {expandedService === service && (
              <div className="flex flex-col gap-2 p-3 border-t">
                {bookings
                  .filter((b) => b.service_name === service)
                  .map((b) => (
                    <div
                      key={b.time + b.client_name + b.service_name}
                      className="flex justify-between items-center bg-gray-50 p-2 rounded transition hover:bg-gray-100"
                    >
                      <div>
                        <span className="font-medium">{b.client_name}</span> - <span className="text-sm text-gray-500">{b.service_name}</span> ({new Date(b.time).toLocaleString()})
                        {b.status && (
                          <span className={`ml-2 px-2 py-0.5 rounded text-sm ${statusColor(b.status)}`}>
                            {b.status}
                            {b.newDate && b.newTime ? `: ${b.newDate} ${b.newTime}` : ""}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="text-green-500 hover:underline"
                          onClick={() => handleAction(b.id, "Confirmed")}
                          disabled={loadingId === b.id}
                        >
                          {loadingId === b.id ? "Processing..." : "Confirm"}
                        </button>
                        <button
                          className="text-blue-500 hover:underline"
                          onClick={() => handleAction(b.id, "Reschedule")}
                          disabled={loadingId === b.id}
                        >
                          {loadingId === b.id ? "Processing..." : "Reschedule"}
                        </button>
                        <button
                          className="text-red-500 hover:underline"
                          onClick={() => handleAction(b.id, "Rejected")}
                          disabled={loadingId === b.id}
                        >
                          {loadingId === b.id ? "Processing..." : "Reject"}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Reschedule Modal */}
      {rescheduleBookingId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-80 transform transition-all duration-200 scale-95 animate-fade-in">
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

      <NavBar />
    </div>
  );
}
