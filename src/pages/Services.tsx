import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { services as initialServices } from "../data/services";

interface Service {
  id: number;
  name: string;
  price: number;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem("services");
    return saved ? JSON.parse(saved) : initialServices;
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [greeting, setGreeting] = useState("");

  // Dynamic greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning!");
    else if (hour < 18) setGreeting("Good afternoon!");
    else setGreeting("Good evening!");
  }, []);

  // Persist services
  useEffect(() => {
    localStorage.setItem("services", JSON.stringify(services));
  }, [services]);

  const openAddModal = () => {
    setEditingService(null);
    setName("");
    setPrice("");
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setName(service.name);
    setPrice(String(service.price));
    setError("");
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!name || !price) {
      setError("Please enter both name and price.");
      return;
    }
    const priceNum = parseFloat(price);
    if (editingService) {
      // Update existing service
      setServices(
        services.map((s) =>
          s.id === editingService.id ? { ...s, name, price: priceNum } : s
        )
      );
    } else {
      // Add new service
      setServices([...services, { id: Date.now(), name, price: priceNum }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    const service = services.find((s) => s.id === id);
    if (service && confirm(`Are you sure you want to delete "${service.name}"?`)) {
      setServices(services.filter((s) => s.id !== id));
    }
  };

  const sortedServices = [...services].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="pb-16 p-4 relative">
      {/* Greeting */}
      <div className="mb-6 p-4 bg-blue-100 rounded shadow">
        <h2 className="text-lg font-bold">{greeting} Welcome to GlamLink!</h2>
        <p className="text-gray-700">
          Add, edit, or remove services and their prices.
        </p>
      </div>

      {/* Add Service Button */}
      <button
        onClick={openAddModal}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        + Add Service
      </button>

      {/* Service List */}
      <div className="flex flex-col gap-2">
        {sortedServices.map((service) => (
          <div
            key={service.id}
            className="flex justify-between items-center bg-white p-3 rounded shadow transition hover:bg-gray-50"
          >
            <span>
              {service.name} - P{service.price.toFixed(2)}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => openEditModal(service)}
                className="text-blue-500 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg relative">
            <h2 className="text-xl font-bold mb-4">
              {editingService ? "Edit Service" : "Add Service"}
            </h2>

            {error && <p className="text-red-500 mb-2">{error}</p>}

            <input
              type="text"
              placeholder="Service Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-3 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full mb-4 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded border hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
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
