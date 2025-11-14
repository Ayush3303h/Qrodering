

// src/components/AdminLogin.jsx
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin(); // notify parent
    } catch (err) {
      setError("Invalid admin credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-lg w-80 sm:w-96 space-y-6 hover:shadow-xl transition"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Admin Login
        </h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Admin Email"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}

