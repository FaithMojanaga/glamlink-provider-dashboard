import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";

export default function Profile() {
  const [greeting, setGreeting] = useState("");
  const [name, setName] = useState("Konopo Faith");
  const [email, setEmail] = useState("faithkonopomojanaga@gmail.com");
  const [role, setRole] = useState("Nail Tech");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning!");
    else if (hour < 18) setGreeting("Good afternoon!");
    else setGreeting("Good evening!");
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
   
    setMessage("Profile updated successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="pb-16 p-4">
      {/* Greeting */}
      <div className="mb-6 p-4 bg-yellow-100 rounded shadow">
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
          <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer hover:bg-blue-600">
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
          className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Save Changes
        </button>

        {/* Success Message */}
        {message && <p className="text-green-500 mt-2">{message}</p>}
      </div>

      <NavBar />
    </div>
  );
}
