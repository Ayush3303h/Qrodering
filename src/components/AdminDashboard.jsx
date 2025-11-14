


// src/components/AdminDashboard.jsx
import { useState, useEffect, useRef } from "react";
import AdminLogin from "./AdminLogin";
import MenuManager from "./MenuManager";
import OrdersManager from "./OrdersManager";
import TableQRGenerator from "./TableQRGenerator";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { FiLogOut, FiMenu, FiClipboard, FiGrid, FiCoffee } from "react-icons/fi";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

export default function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");
  const [hideSidebar, setHideSidebar] = useState(false);
  const lastScrollY = useRef(0);
  const { restaurantSlug } = useParams();

  // 🔹 Watch for login/logout
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoggedIn(true);
        await verifyAdmin(user);
      } else {
        setLoggedIn(false);
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, [restaurantSlug]);

  // 🔹 Improved admin verification (safe, no permission errors)
  const verifyAdmin = async (user) => {
    if (!restaurantSlug || !user) {
      setIsAdmin(false);
      return;
    }

    try {
      const restRef = doc(db, "restaurants", restaurantSlug);
      const restSnap = await getDoc(restRef);

      if (!restSnap.exists()) {
        console.warn(`⚠️ Restaurant "${restaurantSlug}" not found in Firestore.`);
        setIsAdmin(false);
        return;
      }

      const adminsRaw = restSnap.data().adminEmails || [];
      const admins = Array.isArray(adminsRaw)
        ? adminsRaw.map((e) => (typeof e === "string" ? e.trim().toLowerCase() : ""))
        : [];

      const userEmail = (user.email || "").trim().toLowerCase();

      console.log("🔍 Checking admin for:", restaurantSlug, "User:", userEmail, "Admins:", admins);

      // ✅ direct match
      if (admins.includes(userEmail)) {
        setIsAdmin(true);
        return;
      }

      // ✅ fallback single doc read (not query)
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const u = userDocSnap.data();
          const uEmail = (u.email || "").trim().toLowerCase();
          if (
            (u.role === "admin" && u.restaurantSlug === restaurantSlug) ||
            (uEmail === userEmail && u.restaurantSlug === restaurantSlug)
          ) {
            setIsAdmin(true);
            return;
          }
        }
      } catch (userReadErr) {
        console.error("⚠️ verifyAdmin fallback read failed:", userReadErr.code, userReadErr.message);
      }

      setIsAdmin(false);
    } catch (err) {
      console.error("❌ Admin verification failed:", err.code, err.message);
      setIsAdmin(false);
    }
  };

  // 🔹 Responsive sidebar logic
  useEffect(() => {
    const handleResize = () => setSidebarOpen(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      sidebarOpen && window.innerWidth < 768 ? "hidden" : "auto";
  }, [sidebarOpen]);

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
    setIsAdmin(false);
  };

  // 🔹 Render states
  if (loggedIn === null) return null;
  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;
  if (!isAdmin)
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        You are not an admin for <strong>{restaurantSlug}</strong>.
      </div>
    );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {sidebarOpen && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-md"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:relative z-40 flex flex-col h-full backdrop-blur-xl bg-white/70 border-r border-white/30 shadow transition-all 
        ${sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0 md:w-20"} 
        ${hideSidebar && window.innerWidth < 768 ? "-translate-y-full" : ""} 
        rounded-r-3xl overflow-hidden`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/40">
          {sidebarOpen && <h2 className="text-xl font-bold text-indigo-700">Admin Panel</h2>}
          <button
            onClick={() => setSidebarOpen((p) => !p)}
            className="text-gray-700 hover:text-indigo-600"
          >
            <FiMenu size={22} />
          </button>
        </div>

        <nav className="flex-1 mt-4 flex flex-col space-y-1 px-2">
          {[
            { id: "orders", label: "Orders", icon: <FiClipboard size={18} /> },
            { id: "menu", label: "Menu", icon: <FiCoffee size={18} /> },
            { id: "tableqr", label: "Table QR Generator", icon: <FiGrid size={18} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`flex items-center gap-3 p-4 rounded-xl 
              ${
                activeTab === item.id
                  ? "bg-white/60 text-indigo-700 font-semibold"
                  : "text-gray-700 hover:bg-white/40"
              }`}
            >
              {item.icon}
              {(sidebarOpen || window.innerWidth >= 768) && item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-4 mt-auto mb-4 text-red-600 hover:bg-white/40 rounded-xl"
        >
          <FiLogOut size={18} />
          {(sidebarOpen || window.innerWidth >= 768) && "Logout"}
        </button>
      </aside>

      <main
        className={`flex-1 p-4 sm:p-6 space-y-6 overflow-auto ${
          sidebarOpen && window.innerWidth >= 768 ? "md:ml-64" : "md:ml-20"
        }`}
      >
        <div className="md:hidden mb-4 sticky top-0 z-20 backdrop-blur-xl bg-white/70 border border-white/30 rounded-2xl px-4 py-3">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
          <button onClick={() => setSidebarOpen(true)} className="text-gray-700 mt-2">
            <FiMenu size={22} />
          </button>
        </div>

        {activeTab === "orders" && (
          <div className="bg-white/90 rounded-2xl shadow-lg p-4 sm:p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              <FiClipboard /> Orders Dashboard
            </h2>
            <OrdersManager restaurantSlug={restaurantSlug} />
          </div>
        )}

        {activeTab === "menu" && (
          <div className="bg-white/90 rounded-2xl shadow-lg p-4 sm:p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              <FiCoffee /> Menu Management
            </h2>
            <MenuManager restaurantSlug={restaurantSlug} />
          </div>
        )}

        {activeTab === "tableqr" && (
          <div className="bg-white/90 rounded-2xl shadow-lg p-4 sm:p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              <FiGrid /> Table QR Generator
            </h2>
            <TableQRGenerator baseSlug={restaurantSlug} />
          </div>
        )}
      </main>
    </div>
  );
}



