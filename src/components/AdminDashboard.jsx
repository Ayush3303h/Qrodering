
// // src/components/AdminDashboard.jsx
// import { useState } from "react";
// import AdminLogin from "./AdminLogin";
// import MenuManager from "./MenuManager";
// import OrdersManager from "./OrdersManager";
// import { signOut } from "firebase/auth";
// import { auth } from "../firebase/firebaseConfig";

// export default function AdminDashboard() {
//   const [loggedIn, setLoggedIn] = useState(!!auth.currentUser);

//   const handleLogout = async () => {
//     await signOut(auth);
//     setLoggedIn(false);
//   };

//   if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;

//   return (
//     <div className="min-h-screen bg-gray-50 p-6 space-y-6">
//       <header className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Admin Panel</h1>
//         <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
//           Logout
//         </button>
//       </header>
//       <MenuManager />
//       <OrdersManager />
//     </div>
//   );
// }


// // src/components/AdminDashboard.jsx
// import { useState } from "react";
// import AdminLogin from "./AdminLogin";
// import MenuManager from "./MenuManager";
// import OrdersManager from "./OrdersManager";
// import { signOut } from "firebase/auth";
// import { auth } from "../firebase/firebaseConfig";

// export default function AdminDashboard() {
//   const [loggedIn, setLoggedIn] = useState(!!auth.currentUser);

//   const handleLogout = async () => {
//     await signOut(auth);
//     setLoggedIn(false);
//   };

//   if (!loggedIn)
//     return <AdminLogin onLogin={() => setLoggedIn(true)} />;

//   return (
//     <div className="min-h-screen bg-gray-100 p-6 space-y-6">
//       {/* Header */}
//       <header className="flex flex-col md:flex-row justify-between items-center bg-white rounded-xl shadow-lg p-4 md:p-6">
//         <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
//         <button
//           onClick={handleLogout}
//           className="mt-3 md:mt-0 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium shadow transition transform hover:-translate-y-0.5"
//         >
//           Logout
//         </button>
//       </header>

//       {/* Main Content */}
//       <div className="grid md:grid-cols-2 gap-6">
//         {/* Menu Manager */}
//         <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
//           <MenuManager />
//         </div>

//         {/* Orders Manager */}
//         <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
//           <OrdersManager />
//         </div>
//       </div>
//     </div>
//   );
// }



// // src/components/AdminDashboard.jsx
// import { useState } from "react";
// import AdminLogin from "./AdminLogin";
// import MenuManager from "./MenuManager";
// import OrdersManager from "./OrdersManager";
// import { signOut } from "firebase/auth";
// import { auth } from "../firebase/firebaseConfig";

// export default function AdminDashboard() {
//   const [loggedIn, setLoggedIn] = useState(!!auth.currentUser);

//   const handleLogout = async () => {
//     await signOut(auth);
//     setLoggedIn(false);
//   };

//   if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       {/* Header */}
//       <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
//         <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
//         <button
//           onClick={handleLogout}
//           className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md shadow-md hover:shadow-lg transition"
//         >
//           Logout
//         </button>
//       </header>

//       {/* Dashboard Cards */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Menu Manager Card */}
//         <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
//           <h2 className="text-2xl font-semibold text-gray-700 mb-4">
//             Menu Manager
//           </h2>
//           <MenuManager />
//         </div>

//         {/* Orders Manager Card */}
//         <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
//           <h2 className="text-2xl font-semibold text-gray-700 mb-4">
//             Orders Manager
//           </h2>
//           <OrdersManager />
//         </div>
//       </div>
//     </div>
//   );
// }




// src/components/AdminDashboard.jsx
// import { useState } from "react";
// import AdminLogin from "./AdminLogin";
// import MenuManager from "./MenuManager";
// import OrdersManager from "./OrdersManager";
// import { signOut } from "firebase/auth";
// import { auth } from "../firebase/firebaseConfig";
// import { FiMenu, FiLogOut, FiClipboard, FiCoffee } from "react-icons/fi";

// export default function AdminDashboard() {
//   const [loggedIn, setLoggedIn] = useState(!!auth.currentUser);
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [activeTab, setActiveTab] = useState("orders"); // orders or menu

//   const handleLogout = async () => {
//     await signOut(auth);
//     setLoggedIn(false);
//   };

//   if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside
//         className={`bg-white shadow-lg transition-all duration-300 ${
//           sidebarOpen ? "w-64" : "w-16"
//         } flex flex-col`}
//       >
//         <div className="flex items-center justify-between p-4 border-b">
//           {sidebarOpen && <h2 className="text-xl font-bold">Admin Panel</h2>}
//           <button
//             onClick={() => setSidebarOpen((prev) => !prev)}
//             className="text-gray-600 hover:text-gray-800 transition"
//           >
//             <FiMenu size={20} />
//           </button>
//         </div>

//         <nav className="flex-1 mt-4 flex flex-col">
//           <button
//             onClick={() => setActiveTab("orders")}
//             className={`flex items-center gap-3 p-4 hover:bg-gray-100 transition ${
//               activeTab === "orders" ? "bg-indigo-100 font-semibold" : ""
//             }`}
//           >
//             <FiClipboard size={18} />
//             {sidebarOpen && "Orders"}
//           </button>
//           <button
//             onClick={() => setActiveTab("menu")}
//             className={`flex items-center gap-3 p-4 hover:bg-gray-100 transition ${
//               activeTab === "menu" ? "bg-indigo-100 font-semibold" : ""
//             }`}
//           >
//             <FiCoffee size={18} />
//             {sidebarOpen && "Menu"}
//           </button>
//         </nav>

//         <button
//           onClick={handleLogout}
//           className="flex items-center gap-2 p-4 mt-auto mb-4 text-red-600 hover:bg-red-50 transition rounded"
//         >
//           <FiLogOut size={18} />
//           {sidebarOpen && "Logout"}
//         </button>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 p-6 space-y-6 overflow-auto">
//         {activeTab === "orders" && (
//           <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">
//               Orders Dashboard
//             </h2>
//             <OrdersManager />
//           </div>
//         )}

//         {activeTab === "menu" && (
//           <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">
//               Menu Management
//             </h2>
//             <MenuManager />
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }



// src/components/AdminDashboard.jsx
import { useState } from "react";
import AdminLogin from "./AdminLogin";
import MenuManager from "./MenuManager";
import OrdersManager from "./OrdersManager";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { FiLogOut, FiMenu, FiClipboard, FiCoffee } from "react-icons/fi";

export default function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(!!auth.currentUser);
  const [activeTab, setActiveTab] = useState("orders"); // orders or menu

  const handleLogout = async () => {
    await signOut(auth);
    setLoggedIn(false);
  };

  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          <FiLogOut className="w-5 h-5" /> Logout
        </button>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
            activeTab === "orders"
              ? "bg-indigo-600 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-200 shadow-md"
          }`}
        >
          <FiClipboard className="w-5 h-5" /> Orders
        </button>
        <button
          onClick={() => setActiveTab("menu")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
            activeTab === "menu"
              ? "bg-indigo-600 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-200 shadow-md"
          }`}
        >
          <FiMenu className="w-5 h-5" /> Menu
        </button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl p-6 shadow-lg transition hover:shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <FiClipboard /> Orders Management
            </h2>
            <OrdersManager />
          </div>
        )}

        {activeTab === "menu" && (
          <div className="bg-white rounded-2xl p-6 shadow-lg transition hover:shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <FiMenu /> Menu Management
            </h2>
            <MenuManager />
          </div>
        )}
      </div>
    </div>
  );
}
