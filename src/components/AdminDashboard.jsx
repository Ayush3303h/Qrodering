// // 


// import { useEffect, useState } from "react";
// import { collection, getDocs, query, orderBy } from "firebase/firestore";
// import { db } from "../firebase/firebaseConfig";

// export default function AdminDashboard() {
//   const [orders, setOrders] = useState([]);
//   const [status, setStatus] = useState("idle");
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       setStatus("loading");
//       try {
//         const orderQuery = query(collection(db, "orders"), orderBy("timestamp", "desc"));
//         const snapshot = await getDocs(orderQuery);
//         setOrders(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//         setStatus("success");
//       } catch (err) {
//         setError(err.message);
//         setStatus("error");
//       }
//     };
//     fetchOrders();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-[rgba(15,23,42,0.04)] to-[rgba(79,70,229,0.06)] p-10 flex flex-col gap-8">
//       <header>
//         <h1 className="m-0 text-[clamp(2rem,4vw,2.8rem)] font-bold">Kitchen Command Center</h1>
//         <p className="mt-2 text-slate-500">Monitor incoming orders and keep guests delighted.</p>
//       </header>

//       {status === "loading" && (
//         <div className="p-4 rounded-md bg-[rgba(15,23,42,0.06)] text-slate-500">
//           Fetching the latest orders…
//         </div>
//       )}
//       {status === "error" && (
//         <div className="p-4 rounded-md bg-[rgba(239,68,68,0.08)] text-red-500">
//           Unable to load orders. Please refresh.
//           <pre className="mt-2 text-xs whitespace-pre-wrap">{error}</pre>
//         </div>
//       )}
//       {status === "success" && orders.length === 0 && (
//         <div className="p-4 rounded-md bg-[rgba(15,23,42,0.06)] text-slate-500">
//           No orders yet. Enjoy the calm before the dinner rush!
//         </div>
//       )}

//       <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
//         {orders.map((order) => (
//           <article
//             key={order.id}
//             className="bg-white rounded-[16px] shadow-[0_10px_30px_rgba(15,23,42,0.12)] border border-[rgba(15,23,42,0.08)] p-6 flex flex-col gap-4"
//           >
//             <header className="flex justify-between items-center">
//               <span className="flex items-center gap-2">
//                 <strong>Table {order.tableId}</strong>
//                 <span
//                   className={`text-xs rounded-full px-3 py-1 capitalize ${
//                     order.status === "completed"
//                       ? "bg-[rgba(16,185,129,0.12)] text-green-600"
//                       : order.status === "cancelled"
//                       ? "bg-[rgba(239,68,68,0.12)] text-red-500"
//                       : "bg-[rgba(249,115,22,0.12)] text-orange-500"
//                   }`}
//                 >
//                   {order.status ?? "pending"}
//                 </span>
//               </span>
//               {order.timestamp?.toDate && (
//                 <time className="text-slate-400 text-sm">
//                   {order.timestamp.toDate().toLocaleString(undefined, {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     day: "numeric",
//                     month: "short",
//                   })}
//                 </time>
//               )}
//             </header>
//             <ul className="flex flex-col gap-2 m-0 p-0 list-none">
//               {order.items?.map((item) => (
//                 <li
//                   key={item.id}
//                   className="grid grid-cols-[1fr_auto_auto] gap-2 text-slate-600 text-sm"
//                 >
//                   <span>{item.name}</span>
//                   <span>× {item.quantity}</span>
//                   <span>₹{(item.price * item.quantity).toFixed(2)}</span>
//                 </li>
//               ))}
//             </ul>
//             <footer className="flex justify-between items-center border-t border-[rgba(15,23,42,0.08)] pt-3">
//               <span>Total</span>
//               <strong className="text-lg">₹{Number(order.total).toFixed(2)}</strong>
//             </footer>
//           </article>
//         ))}
//       </div>
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
