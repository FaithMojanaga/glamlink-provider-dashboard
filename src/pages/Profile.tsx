import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";

export default function Profile() {
  const [showModal, setShowModal] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning!");
    else if (hour < 18) setGreeting("Good afternoon!");
    else setGreeting("Good evening!");
    // Load user info from localStorage
    const storedName = localStorage.getItem("providerName") || "";
    const storedEmail = localStorage.getItem("userEmail") || "";
    const storedPhone = localStorage.getItem("userPhone") || "";
    const storedRole = localStorage.getItem("userRole") || "";
    setName(storedName);
    setEmail(storedEmail);
    setPhone(storedPhone);
    setRole(storedRole);
  }, []);

  // Handle profile picture upload
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => setProfilePic(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Save changes
  const handleSave = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setMessage("User ID not found. Please log in again.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    import("../api").then(({ default: api }) => {
      api.put(`/providers/${userId}`, {
        name,
        email,
        phone,
        role,
      })
        .then(() => {
          // Fetch updated provider info
          api.get(`/providers/${userId}`)
            .then((providerRes) => {
              const provider = providerRes.data as {
                name?: string;
                email?: string;
                phone?: string;
                role?: string;
              };
              setName(provider.name ?? name);
              setEmail(provider.email ?? email);
              setPhone(provider.phone ?? phone);
              setRole(provider.role ?? role);
              localStorage.setItem("providerName", provider.name ?? name);
              localStorage.setItem("userEmail", provider.email ?? email);
              localStorage.setItem("userPhone", provider.phone ?? phone);
              localStorage.setItem("userRole", provider.role ?? role);
              setMessage("Profile updated successfully!");
              setShowModal(true);
              setTimeout(() => {
                setMessage("");
                setShowModal(false);
              }, 3000);
            })
            .catch((error) => {
              console.error("Fetch updated provider error:", error);
              setMessage("Profile updated, but failed to fetch latest info.");
              setTimeout(() => setMessage(""), 3000);
            });
        })
        .catch((error) => {
          console.error("Profile update error:", error);
          setMessage("Failed to update profile. Please try again.");
          setTimeout(() => setMessage(""), 3000);
        });
    });
  };

  return (
    <div className="pb-16 p-4">
      {/* Greeting */}
  <div className="mb-6 p-4 bg-pink-500 rounded shadow text-white">
        <h2 className="text-lg font-bold">{greeting} {name}!</h2>
        <p className="text-gray-700">
          Update your profile information below.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white p-6 rounded shadow max-w-md mx-auto flex flex-col items-center gap-4">
        {/* Profile Picture */}
        <div className="relative">
          <img
            src={profilePic || "/default-profile.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border"
          />
          <label className="absolute bottom-0 right-0 bg-pink-500 text-white p-1 rounded-full cursor-pointer hover:bg-pink-600">
            <input type="file" accept="image/*" className="hidden" onChange={handleProfilePicChange} />
            ✎
          </label>
        </div>

        {/* Editable Fields */}
        <div className="w-full flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="Nail Tech">Nail Tech</option>
              <option value="Barber">Barber</option>
              <option value="Stylist">Stylist</option>
              <option value="Makeup Artist">Makeup Artist</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="mt-4 w-full bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition"
        >
          Save Changes
        </button>

        {/* Success Message */}
        {message && <p className="text-green-500 mt-2">{message}</p>}

        {/* Modal Dialog */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white border border-green-500 rounded-lg shadow-lg p-6 flex flex-col items-center">
              <span className="text-green-600 text-xl font-bold mb-2">Success!</span>
              <span className="text-gray-700 mb-4">Profile has been updated successfully.</span>
              <button
                className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
                onClick={() => setShowModal(false)}
              >
                OK
              </button>
            </div>
            <div className="fixed inset-0 bg-black opacity-30 z-40" />
          </div>
        )}
      </div>

      <NavBar />
    </div>
  );
}
