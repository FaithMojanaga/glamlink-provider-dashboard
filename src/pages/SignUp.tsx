import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = () => {
    if (!fullName || !phone || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const user = { fullName, phone, email, password }; 
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("isLoggedIn", "true");

    navigate("/Services");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm flex flex-col items-center">
        <img src={Logo} alt="GlamLink Logo" className="w-24 h-24 mb-4" />
        <h1 className="text-3xl font-bold text-pink-600 mb-6">Create Account</h1>

        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}

        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full mb-3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mb-3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
        />

        <button
          onClick={handleSignUp}
          className="bg-pink-600 text-white px-6 py-3 rounded-lg w-full hover:bg-pink-700 transition"
        >
          Sign Up
        </button>

        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <span
            className="text-pink-500 cursor-pointer hover:underline"
            onClick={() => navigate("/Login")}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}
