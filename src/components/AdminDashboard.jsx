
// src/components/AdminDashboard.jsx
import { useState } from "react";
import AdminLogin from "./AdminLogin";
import MenuManager from "./MenuManager";
import OrdersManager from "./OrdersManager";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export default function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(!!auth.currentUser);

  const handleLogout = async () => {
    await signOut(auth);
    setLoggedIn(false);
  };

  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
          Logout
        </button>
      </header>
      <MenuManager />
      <OrdersManager />
    </div>
  );
}
