type ProviderLoginResponse = {
  id?: string | number;
  userId?: string | number;
  name?: string;
  fullName?: string;
  provider_name?: string;
  email?: string;
  phone?: string;
  role?: string;
  // add other fields if needed
};
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.png";
import api from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    api.post<ProviderLoginResponse>("/providers/login", { email, password })
      .then((response) => {
          console.log('Login response:', response.data); // Debug: check property names
          const userId = response.data.id ?? response.data.userId ?? null;
          const name = response.data.name ?? response.data.fullName ?? response.data.provider_name ?? "";
          const email = response.data.email ?? "";
          const phone = response.data.phone ?? "";
          const role = response.data.role ?? "";
          // If all required fields are present, store them and skip GET request
          if (userId && name && email && phone && role) {
            localStorage.setItem("userId", userId.toString());
            localStorage.setItem("providerName", name);
            localStorage.setItem("userEmail", email);
            localStorage.setItem("userPhone", phone);
            localStorage.setItem("userRole", role);
            localStorage.setItem("isLoggedIn", "true");
            navigate("/dashboard");
          } else if (userId) {
            localStorage.setItem("userId", userId.toString());
            // Fetch full provider info only if something is missing
            api.get(`/providers/${userId}`)
              .then((providerRes) => {
                const provider = providerRes.data as {
                  name?: string;
                  email?: string;
                  phone?: string;
                  role?: string;
                };
                localStorage.setItem("providerName", provider.name ?? name);
                localStorage.setItem("userEmail", provider.email ?? email);
                localStorage.setItem("userPhone", provider.phone ?? phone);
                localStorage.setItem("userRole", provider.role ?? role);
                localStorage.setItem("isLoggedIn", "true");
                navigate("/dashboard");
              })
              .catch((err) => {
                // fallback: store what we have
                localStorage.setItem("providerName", name);
                localStorage.setItem("userEmail", email);
                if (phone) {
                  localStorage.setItem("userPhone", phone);
                }
                if (role) {
                  localStorage.setItem("userRole", role);
                }
                localStorage.setItem("isLoggedIn", "true");
                navigate("/dashboard");
              });
          } else {
            // fallback: store what we have
            if (name) {
              localStorage.setItem("providerName", name);
            }
            if (email) {
              localStorage.setItem("userEmail", email);
            }
            if (phone) {
              localStorage.setItem("userPhone", phone);
            }
            if (role) {
              localStorage.setItem("userRole", role);
            }
            localStorage.setItem("isLoggedIn", "true");
            navigate("/dashboard");
          }
      })
      .catch((error) => {
        if (error.response && error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError("Invalid email or password.");
        }
      });
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
          Demo account: <br />
          <span className="font-medium">test@glamlink.com</span> /{" "}
          <span className="font-medium">123456</span>
        </p>

       
        <p className="mt-6 text-sm text-gray-700">
          No account?{" "}
          <Link to="/signup" className="text-pink-600 hover:underline font-medium">
            Sign up!
          </Link>
        </p>
      </div>
    </div>
  );
}

localStorage.removeItem('userId');
