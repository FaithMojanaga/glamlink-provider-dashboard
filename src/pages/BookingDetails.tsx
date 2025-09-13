// src/pages/BookingDetails.tsx
import { useParams, useNavigate } from "react-router-dom";
import { bookings } from "../data/bookings";

export default function BookingDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // find booking by id
  const booking = bookings.find((b) => b.id.toString() === id);

  if (!booking) {
    return (
      <div className="p-6 min-h-screen bg-gray-50">
        <p className="text-red-500">Booking not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-3 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
  <header className="flex justify-between items-center mb-6 bg-pink-500 text-white rounded shadow p-4">
        <h1 className="text-2xl font-bold text-pink-600">Booking Details</h1>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-pink-500 underline"
        >
          ← Back
        </button>
      </header>

      {/* Card */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">{booking.service}</h2>

        <div className="space-y-3 text-gray-700">
          <p>
            <span className="font-medium">Client:</span> {booking.client}
          </p>
          <p>
            <span className="font-medium">Date:</span> {booking.date}
          </p>
          <p>
            <span className="font-medium">Status:</span>{" "}
            <span
              className={`px-2 py-1 rounded text-sm ${
                booking.status === "Confirmed" || booking.status === "Complete"
                  ? "bg-green-100 text-green-600"
                  : booking.status === "Pending"
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {booking.status}
            </span>
          </p>
          <p>
            <span className="font-medium">Price:</span> P{booking.price ?? "350.00"}
          </p>
        </div>
      </div>
    </div>
  );
}
