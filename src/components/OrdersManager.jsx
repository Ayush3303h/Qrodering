
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

  // ✅ Real-time Firestore listener
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "orders"), (snapshot) => {
      const liveOrders = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          items: Array.isArray(data.items) ? data.items : [],
          tableId: data.tableId || "N/A",  // Ensure tableId is included
        };
      });
      setOrders(liveOrders);
    });

    return () => unsub();
  }, []);

  // ✅ Live countdown logic
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimers = {};
      orders.forEach((order) => {
        if (
          order.status === "approved" &&
          order.startTime &&
          order.completionTime
        ) {
          const endTime =
            order.startTime.toDate().getTime() +
            order.completionTime * 60 * 1000;
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

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-6">
      <h2 className="text-xl font-semibold">Orders</h2>
      <div className="grid gap-4">
        {orders.map((order) => {
          const remaining = timers[order.id];
          const showTimer =
            order.status === "approved" &&
            order.startTime &&
            remaining !== undefined;

          const totalPrice = order.items.reduce(
            (sum, item) =>
              sum + ((item?.modifiers?.[0]?.option?.price ?? item?.price ?? 0) * item.quantity),
            0
          );

          return (
            <div
              key={order.id}
              className="p-4 border rounded-md flex flex-col gap-3"
            >
              <div className="flex justify-between">
                <h3 className="font-medium">
                  Table: {order.tableId || "N/A"}
                </h3>
                <span
                  className={`text-sm capitalize ${
                    order.status === "rejected"
                      ? "text-red-600"
                      : order.status === "completed"
                      ? "text-blue-600"
                      : order.status === "approved"
                      ? "text-green-600"
                      : ""
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <ul className="text-sm list-disc list-inside">
                {(order.items || []).map((i, idx) => (
                  <li key={idx}>
                    {i?.name} × {i?.quantity} - ₹
                    {((i?.modifiers?.[0]?.option?.price ?? i?.price ?? 0) * i.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>

              <div className="flex justify-between text-sm font-semibold pt-1 border-t">
                <span>Total:</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>

              {showTimer && (
                <p className="text-sm text-green-600 font-medium">
                  {remaining > 0
                    ? `⏱️ ${formatTime(remaining)} remaining`
                    : "✅ Ready!"}
                </p>
              )}

              {order.status === "pending" && (
                <div className="flex items-center gap-3">
                  <select
                    className="border rounded px-2 py-1"
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
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded disabled:bg-gray-400"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(order.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}

              {order.status === "approved" && (
                <button
                  onClick={() => handleComplete(order.id)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
                >
                  Mark as Completed
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
