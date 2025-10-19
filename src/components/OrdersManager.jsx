
// import { useEffect, useState } from "react";
// import {
//   collection,
//   updateDoc,
//   doc,
//   serverTimestamp,
//   onSnapshot,
// } from "firebase/firestore";
// import { db } from "../firebase/firebaseConfig";

// export default function OrdersManager() {
//   const [orders, setOrders] = useState([]);
//   const [selectedTime, setSelectedTime] = useState({});
//   const [timers, setTimers] = useState({});
//   const [selectedDate, setSelectedDate] = useState("");
//   const [showPastOrders, setShowPastOrders] = useState(false); // toggle for past orders

//   // ✅ Real-time listener
//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "orders"), (snapshot) => {
//       const liveOrders = snapshot.docs.map((d) => {
//         const data = d.data();
//         return {
//           id: d.id,
//           ...data,
//           items: Array.isArray(data.items) ? data.items : [],
//           tableId: data.tableId || "N/A",
//           createdAt: data.createdAt?.toDate?.() || new Date(),
//         };
//       });
//       setOrders(liveOrders);
//     });

//     return () => unsub();
//   }, []);

//   // ✅ Timer updater for approved orders (fixed)
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const newTimers = {};
//       orders.forEach((order) => {
//         if (
//           order.status === "approved" &&
//           order.startTime &&
//           order.completionTime
//         ) {
//           // Safely convert Firestore Timestamp to JS Date
//           const startTime =
//             order.startTime.toDate?.() || new Date(order.startTime);
//           const endTime = startTime.getTime() + order.completionTime * 60 * 1000;
//           const diff = endTime - Date.now();
//           newTimers[order.id] = diff > 0 ? diff : 0;
//         }
//       });
//       setTimers(newTimers);
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [orders]);

//   const formatTime = (ms) => {
//     const min = Math.floor(ms / 60000);
//     const sec = Math.floor((ms % 60000) / 1000);
//     return `${min}:${sec.toString().padStart(2, "0")}`;
//   };

//   const handleReject = async (id) => {
//     await updateDoc(doc(db, "orders", id), { status: "rejected" });
//   };

//   const handleApprove = async (id) => {
//     const time = selectedTime[id] || 10;
//     await updateDoc(doc(db, "orders", id), {
//       status: "approved",
//       completionTime: time,
//       startTime: serverTimestamp(), // sync admin + user timer
//     });
//   };

//   const handleComplete = async (id) => {
//     await updateDoc(doc(db, "orders", id), { status: "completed" });
//   };

//   // 🧮 Date filtering logic
//   const today = new Date();
//   const todayStr = today.toISOString().split("T")[0];

//   const todaysOrders = orders.filter((order) => {
//     const dateStr = order.createdAt.toISOString().split("T")[0];
//     return dateStr === todayStr;
//   });

//   const pastOrders = orders.filter((order) => {
//     const dateStr = order.createdAt.toISOString().split("T")[0];
//     return dateStr !== todayStr;
//   });

//   const sortedPastOrders = [...pastOrders].sort(
//     (a, b) => b.createdAt - a.createdAt
//   );

//   const filteredPastOrders = selectedDate
//     ? sortedPastOrders.filter(
//         (order) => order.createdAt.toISOString().split("T")[0] === selectedDate
//       )
//     : sortedPastOrders;

//   // 🧱 Reusable Order Card Renderer
//   const renderOrderCard = (order) => {
//     const remaining = timers[order.id];
//     const showTimer =
//       order.status === "approved" &&
//       order.startTime &&
//       remaining !== undefined;

//     const totalPrice = order.items.reduce(
//       (sum, item) =>
//         sum +
//         ((item?.modifiers?.[0]?.option?.price ?? item?.price ?? 0) *
//           item.quantity),
//       0
//     );

//     return (
//       <div key={order.id} className="p-4 border rounded-md flex flex-col gap-3">
//         <div className="flex justify-between">
//           <h3 className="font-medium">Table: {order.tableId || "N/A"}</h3>
//           <span
//             className={`text-sm capitalize ${
//               order.status === "rejected"
//                 ? "text-red-600"
//                 : order.status === "completed"
//                 ? "text-blue-600"
//                 : order.status === "approved"
//                 ? "text-green-600"
//                 : ""
//             }`}
//           >
//             {order.status}
//           </span>
//         </div>

//         <ul className="text-sm list-disc list-inside">
//           {(order.items || []).map((i, idx) => (
//             <li key={idx}>
//               {i?.name} × {i?.quantity} - ₹
//               {(
//                 (i?.modifiers?.[0]?.option?.price ?? i?.price ?? 0) *
//                 i.quantity
//               ).toFixed(2)}
//             </li>
//           ))}
//         </ul>

//         <div className="flex justify-between text-sm font-semibold pt-1 border-t">
//           <span>Total:</span>
//           <span>₹{totalPrice.toFixed(2)}</span>
//         </div>

//         {showTimer && (
//           <p className="text-sm text-green-600 font-medium">
//             {remaining > 0
//               ? `⏱️ ${formatTime(remaining)} remaining`
//               : "✅ Ready!"}
//           </p>
//         )}

//         {order.status === "pending" && (
//           <div className="flex items-center gap-3">
//             <select
//               className="border rounded px-2 py-1"
//               value={selectedTime[order.id] || ""}
//               onChange={(e) =>
//                 setSelectedTime((prev) => ({
//                   ...prev,
//                   [order.id]: Number(e.target.value),
//                 }))
//               }
//             >
//               <option value="">Select time</option>
//               <option value="5">5 min</option>
//               <option value="10">10 min</option>
//               <option value="15">15 min</option>
//               <option value="20">20 min</option>
//             </select>
//             <button
//               onClick={() => handleApprove(order.id)}
//               disabled={!selectedTime[order.id]}
//               className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded disabled:bg-gray-400"
//             >
//               Approve
//             </button>
//             <button
//               onClick={() => handleReject(order.id)}
//               className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
//             >
//               Reject
//             </button>
//           </div>
//         )}

//         {order.status === "approved" && (
//           <button
//             onClick={() => handleComplete(order.id)}
//             className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
//           >
//             Mark as Completed
//           </button>
//         )}

//         <p className="text-xs text-gray-400">
//           Date: {order.createdAt.toLocaleDateString()}{" "}
//           {order.createdAt.toLocaleTimeString()}
//         </p>
//       </div>
//     );
//   };

//   return (
//     <div className="bg-white p-6 rounded-xl shadow space-y-6">
//       {/* ✅ Today's Orders */}
//       <h2 className="text-xl font-semibold">Today's Orders</h2>
//       <div className="grid gap-4">
//         {todaysOrders.length > 0 ? (
//           todaysOrders.map(renderOrderCard)
//         ) : (
//           <p className="text-gray-500 text-sm">No orders for today.</p>
//         )}
//       </div>

//       {/* ✅ Collapsible Past Orders Section */}
//       <div className="mt-8">
//         <div className="flex justify-between items-center">
//           <h2 className="text-xl font-semibold">Past Orders</h2>
//           <button
//             onClick={() => setShowPastOrders((prev) => !prev)}
//             className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
//           >
//             {showPastOrders ? "Hide Past Orders ▲" : "Show Past Orders ▼"}
//           </button>
//         </div>

//         {showPastOrders && (
//           <div className="mt-4 space-y-4">
//             <div className="flex items-center gap-3">
//               <label className="text-sm text-gray-700">Select Date:</label>
//               <input
//                 type="date"
//                 value={selectedDate}
//                 onChange={(e) => setSelectedDate(e.target.value)}
//                 className="border rounded px-2 py-1 text-sm"
//               />
//               <button
//                 onClick={() => setSelectedDate("")}
//                 className="text-sm text-gray-500 hover:text-gray-700"
//               >
//                 Clear
//               </button>
//             </div>

//             <div className="grid gap-4">
//               {filteredPastOrders.length > 0 ? (
//                 filteredPastOrders.map(renderOrderCard)
//               ) : (
//                 <p className="text-gray-500 text-sm">
//                   No past orders found for this date.
//                 </p>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }





import { useEffect, useState } from "react";
import {
  collection,
  updateDoc,
  doc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [selectedTime, setSelectedTime] = useState({});
  const [timers, setTimers] = useState({});
  const [selectedDate, setSelectedDate] = useState("");
  const [showPastOrders, setShowPastOrders] = useState(false);

  // Real-time listener
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "orders"), (snapshot) => {
      const liveOrders = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          items: Array.isArray(data.items) ? data.items : [],
          tableId: data.tableId || "N/A",
          createdAt: data.createdAt?.toDate?.() || new Date(),
        };
      });
      setOrders(liveOrders);
    });

    return () => unsub();
  }, []);

  // Timer updater
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimers = {};
      orders.forEach((order) => {
        if (
          order.status === "approved" &&
          order.startTime &&
          order.completionTime
        ) {
          const startTime = order.startTime.toDate?.() || new Date(order.startTime);
          const endTime = startTime.getTime() + order.completionTime * 60 * 1000;
          const diff = endTime - Date.now();
          newTimers[order.id] = diff > 0 ? diff : 0;
        }
      });
      setTimers(newTimers);
    }, 1000);

    return () => clearInterval(interval);
  }, [orders]);

  const formatTime = (ms) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const handleReject = async (id) => {
    await updateDoc(doc(db, "orders", id), { status: "rejected" });
  };

  const handleApprove = async (id) => {
    const time = selectedTime[id] || 10;
    await updateDoc(doc(db, "orders", id), {
      status: "approved",
      completionTime: time,
      startTime: serverTimestamp(),
    });
  };

  const handleComplete = async (id) => {
    await updateDoc(doc(db, "orders", id), { status: "completed" });
  };

  // Date filtering
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  const todaysOrders = orders.filter(
    (order) => order.createdAt.toISOString().split("T")[0] === todayStr
  );

  const pastOrders = orders.filter(
    (order) => order.createdAt.toISOString().split("T")[0] !== todayStr
  );

  const sortedPastOrders = [...pastOrders].sort(
    (a, b) => b.createdAt - a.createdAt
  );

  const filteredPastOrders = selectedDate
    ? sortedPastOrders.filter(
        (order) =>
          order.createdAt.toISOString().split("T")[0] === selectedDate
      )
    : sortedPastOrders;

  // Render Order Card
  const renderOrderCard = (order) => {
    const remaining = timers[order.id];
    const showTimer =
      order.status === "approved" &&
      order.startTime &&
      remaining !== undefined;

    const totalPrice = order.items.reduce(
      (sum, item) =>
        sum +
        ((item?.modifiers?.[0]?.option?.price ?? item?.price ?? 0) *
          item.quantity),
      0
    );

    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      rejected: "bg-red-100 text-red-800",
    };

    return (
      <div
        key={order.id}
        className="p-5 border rounded-2xl shadow-md hover:shadow-xl transition flex flex-col gap-3 bg-white"
      >
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-700">
            Table: {order.tableId || "N/A"}
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[order.status]}`}
          >
            {order.status}
          </span>
        </div>

        <ul className="text-sm list-disc list-inside space-y-1">
          {order.items.map((i, idx) => (
            <li key={idx}>
              {i?.name} × {i?.quantity} - ₹
              {(
                (i?.modifiers?.[0]?.option?.price ?? i?.price ?? 0) *
                i.quantity
              ).toFixed(2)}
            </li>
          ))}
        </ul>

        <div className="flex justify-between text-sm font-semibold pt-2 border-t border-gray-200">
          <span>Total:</span>
          <span>₹{totalPrice.toFixed(2)}</span>
        </div>

        {showTimer && (
          <p className="text-sm text-green-600 font-medium shadow px-2 py-1 rounded mt-1 inline-block">
            {remaining > 0
              ? `⏱️ ${formatTime(remaining)} remaining`
              : "✅ Ready!"}
          </p>
        )}

        {order.status === "pending" && (
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <select
              className="border rounded px-2 py-1 shadow-sm focus:ring-2 focus:ring-indigo-400"
              value={selectedTime[order.id] || ""}
              onChange={(e) =>
                setSelectedTime((prev) => ({
                  ...prev,
                  [order.id]: Number(e.target.value),
                }))
              }
            >
              <option value="">Select time</option>
              <option value="5">5 min</option>
              <option value="10">10 min</option>
              <option value="15">15 min</option>
              <option value="20">20 min</option>
            </select>
            <button
              onClick={() => handleApprove(order.id)}
              disabled={!selectedTime[order.id]}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded shadow-sm disabled:bg-gray-400"
            >
              Approve
            </button>
            <button
              onClick={() => handleReject(order.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow-sm"
            >
              Reject
            </button>
          </div>
        )}

        {order.status === "approved" && (
          <button
            onClick={() => handleComplete(order.id)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded shadow-sm mt-2"
          >
            Mark as Completed
          </button>
        )}

        <p className="text-xs text-gray-400 mt-2">
          Date: {order.createdAt.toLocaleDateString()}{" "}
          {order.createdAt.toLocaleTimeString()}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Today's Orders */}
      <div className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Today's Orders</h2>
        <div className="grid gap-4">
          {todaysOrders.length > 0 ? (
            todaysOrders.map(renderOrderCard)
          ) : (
            <p className="text-gray-500 text-sm">No orders for today.</p>
          )}
        </div>
      </div>

      {/* Past Orders */}
      <div className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Past Orders</h2>
          <button
            onClick={() => setShowPastOrders((prev) => !prev)}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {showPastOrders ? "Hide ▲" : "Show ▼"}
          </button>
        </div>

        {showPastOrders && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-700">Select Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-400"
              />
              <button
                onClick={() => setSelectedDate("")}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            </div>

            <div className="grid gap-4">
              {filteredPastOrders.length > 0 ? (
                filteredPastOrders.map(renderOrderCard)
              ) : (
                <p className="text-gray-500 text-sm">
                  No past orders found for this date.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
