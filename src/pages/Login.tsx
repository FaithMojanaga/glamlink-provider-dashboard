import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // For demo purposes
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (
      (storedUser.email === email && storedUser.password === password) ||
      (email === "test@glamlink.com" && password === "123456")
    ) {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/Services");
    } else {
      setError("Invalid email or password. Use test@glamlink.com / 123456");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm flex flex-col items-center">
        <img src={Logo} alt="GlamLink Logo" className="w-24 h-24 mb-4" />
        <h1 className="text-3xl font-bold text-pink-600 mb-6"></h1>

        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}

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

        <button
          onClick={handleLogin}
          className="bg-pink-600 text-white px-6 py-3 rounded-lg w-full hover:bg-pink-700 transition"
        >
          Sign In
        </button>

        <p className="mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <span
            className="text-pink-500 cursor-pointer hover:underline"
            onClick={() => navigate("/SignUp")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
