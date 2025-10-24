


import { useState, useEffect, useRef } from "react";
import AdminLogin from "./AdminLogin";
import MenuManager from "./MenuManager";
import OrdersManager from "./OrdersManager";
import TableQRGenerator from "./TableQRGenerator";
import { signOut, onAuthStateChanged } from "firebase/auth"; // ✅ added here
import { auth } from "../firebase/firebaseConfig";
import {
  FiLogOut,
  FiMenu,
  FiClipboard,
  FiGrid,
  FiCoffee,
} from "react-icons/fi";

export default function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(null); // ✅ start as null (loading)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");
  const [hideSidebar, setHideSidebar] = useState(false);
  const lastScrollY = useRef(0);

  // ✅ Persist login session
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setLoggedIn(true);
      else setLoggedIn(false);
    });
    return () => unsubscribe();
  }, []);

  // Responsive auto-collapse
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Disable body scroll when sidebar open (mobile)
  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [sidebarOpen]);

  // Auto-hide sidebar on scroll (mobile)
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (window.innerWidth < 768) {
        if (currentY > lastScrollY.current + 10) setHideSidebar(true);
        else if (currentY < lastScrollY.current - 10) setHideSidebar(false);
        lastScrollY.current = currentY;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setLoggedIn(false);
  };

  // ✅ Wait for Firebase to load user before showing login/dashboard
  if (loggedIn === null) return null;
  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {sidebarOpen && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <aside
        className={`fixed md:relative z-40 flex flex-col h-full 
          backdrop-blur-xl bg-white/70 border-r border-white/30
          shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0 md:w-20"}
          ${hideSidebar && window.innerWidth < 768 ? "-translate-y-full" : ""}
          ${sidebarOpen ? "animate-fadeSlideIn" : ""}
          rounded-r-3xl overflow-hidden`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/40">
          {sidebarOpen && (
            <h2 className="text-xl font-bold text-indigo-700 whitespace-nowrap drop-shadow-sm">
              Admin Panel
            </h2>
          )}
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="text-gray-700 hover:text-indigo-600 transition"
            title="Toggle Sidebar"
          >
            <FiMenu size={22} />
          </button>
        </div>

        <nav className="flex-1 mt-4 flex flex-col space-y-1 px-2">
          {[
            { id: "orders", label: "Orders", icon: <FiClipboard size={18} /> },
            { id: "menu", label: "Menu", icon: <FiCoffee size={18} /> },
            {
              id: "tableqr",
              label: "Table QR Generator",
              icon: <FiGrid size={18} />,
            },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`flex items-center gap-3 p-4 rounded-xl relative overflow-hidden group transition-all duration-300
                ${
                  activeTab === item.id
                    ? "bg-white/60 text-indigo-700 font-semibold animate-glowBorder"
                    : "text-gray-700 hover:bg-white/40"
                }`}
            >
              {item.icon}
              {(sidebarOpen || window.innerWidth >= 768) && item.label}

              {activeTab === item.id && (
                <span className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-400 opacity-60 blur-[2px] animate-glow"></span>
              )}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-4 mt-auto mb-4 text-red-600 hover:bg-white/40 rounded-xl transition"
        >
          <FiLogOut size={18} />
          {(sidebarOpen || window.innerWidth >= 768) && "Logout"}
        </button>
      </aside>

      <main
        className={`flex-1 p-4 sm:p-6 space-y-6 overflow-auto transition-all duration-300 ${
          sidebarOpen && window.innerWidth >= 768 ? "md:ml-64" : "md:ml-20"
        }`}
      >
        <div
          className="flex justify-between items-center md:hidden mb-4 sticky top-0 z-20
          backdrop-blur-xl bg-white/70 border border-white/30
          shadow-[0_4px_20px_rgba(0,0,0,0.05)] rounded-2xl px-4 py-3
          animate-fadeSlideIn"
        >
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 hover:text-indigo-600 transition"
          >
            <FiMenu size={22} />
          </button>
        </div>

        {activeTab === "orders" && (
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-4 sm:p-6 space-y-6 animate-fadeSlideIn border border-white/50">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiClipboard /> Orders Dashboard
            </h2>
            <OrdersManager />
          </div>
        )}

        {activeTab === "menu" && (
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-4 sm:p-6 space-y-6 animate-fadeSlideIn border border-white/50">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiCoffee /> Menu Management
            </h2>
            <MenuManager />
          </div>
        )}

        {activeTab === "tableqr" && (
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-4 sm:p-6 space-y-6 animate-fadeSlideIn border border-white/50">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiGrid /> Table QR Generator
            </h2>
            <TableQRGenerator />
          </div>
        )}
      </main>
    </div>
  );
}
