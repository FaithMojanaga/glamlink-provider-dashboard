import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import api from "../api";

interface Service {
  id: number;
  name: string;
  price: number;
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);

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

    // Fetch services for logged-in user
    const userId = localStorage.getItem("userId");
    if (userId) {
      api
        .get<Service[]>(`/services/provider/${userId}`)
        .then((response) => {
          setServices(response.data);
        })
        .catch(() => {
          setServices([]);
        });
    }
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
    const userId = localStorage.getItem("userId");
    if (editingService) {
      // Edit service
      api
        .put(`/services/${editingService.id}`, { name, price: priceNum })
        .then(() => {
          // Refresh services list
          if (userId) {
            api
              .get<Service[]>(`/services/provider/${userId}`)
              .then((response) => setServices(response.data));
          }
          setModalOpen(false);
        })
        .catch(() => setError("Failed to update service."));
    } else {
      // Add new service
      if (userId) {
        api
          .post(`/services`, { name, price: priceNum, provider_id: userId })
          .then(() => {
            api
              .get<Service[]>(`/services/provider/${userId}`)
              .then((response) => setServices(response.data));
            setModalOpen(false);
          })
          .catch(() => setError("Failed to add service."));
      }
    }
  };

  const handleDelete = (id: number) => {
    const service = services.find((s) => s.id === id);
    const userId = localStorage.getItem("userId");
    if (
      service &&
      confirm(`Are you sure you want to delete "${service.name}"?`)
    ) {
      api
        .delete(`/services/${id}`)
        .then(() => {
          if (userId) {
            api
              .get<Service[]>(`/services/provider/${userId}`)
              .then((response) => setServices(response.data));
          }
        })
        .catch(() => setError("Failed to delete service."));
    }
  };

  const sortedServices = [...services].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className="pb-16 p-4 relative">
      {/* Greeting */}
  <div className="mb-6 p-4 bg-pink-500 rounded shadow text-white">
        <h2 className="text-lg font-bold">{greeting} Welcome to GlamLink!</h2>
        <p className="text-gray-700">
          Add, edit, or remove services and their prices.
        </p>
      </div>

      {/* Add Service Button */}
      <button
        onClick={openAddModal}
        className="mb-4 bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition"
      >
        + Add Service
      </button>

      {/* Service List */}
      <div className="grid grid-cols-4 gap-4">
        {sortedServices.map((service) => (

          <div
            key={service.id}
            className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
          >
            <div>
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-pink-600 dark:text-pink-400">
                {service.name}
              </h5>
            </div>
            <div className="mb-3 font-normal text-gray-700 dark:text-gray-400 flex gap-2">
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
            <div 
              className="inline-flex items-center px-3 py-2 text-sm font-bold text-pink-600 bg-pink-100 rounded-lg border border-pink-200"
            >
              P{!isNaN(Number(service.price))
                ? Number(service.price).toFixed(2)
                : "0.00"}
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
