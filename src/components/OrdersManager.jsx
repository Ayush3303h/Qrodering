import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [selectedTime, setSelectedTime] = useState({}); // store time selection per order

  const fetchOrders = async () => {
    const snapshot = await getDocs(collection(db, "orders"));
    setOrders(snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        items: Array.isArray(data.items) ? data.items : []
      };
    }));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleReject = async (id) => {
    await updateDoc(doc(db, "orders", id), { status: "rejected" });
    fetchOrders();
  };

  const handleApprove = async (id) => {
    const time = selectedTime[id] || 10; // default 10 min if not selected
    await updateDoc(doc(db, "orders", id), {
      status: "approved",
      completionTime: time,
      startTime: serverTimestamp()
    });
    fetchOrders();
  };

  const handleComplete = async (id) => {
    await updateDoc(doc(db, "orders", id), { status: "completed" });
    fetchOrders();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-6">
      <h2 className="text-xl font-semibold">Orders</h2>
      <div className="grid gap-4">
        {orders.map((order) => (
          <div key={order.id} className="p-4 border rounded-md flex flex-col gap-3">
            <div className="flex justify-between">
              <h3 className="font-medium">Table {order.tableId}</h3>
              <span className={`text-sm capitalize ${order.status === "rejected" ? "text-red-600" : ""}`}>
                {order.status}
              </span>
            </div>

            <ul className="text-sm list-disc list-inside">
              {(order.items || []).map((i, idx) => (
                <li key={idx}>{i?.name} × {i?.quantity}</li>
              ))}
            </ul>

            {order.status === "pending" && (
              <div className="flex items-center gap-3">
                <select
                  className="border rounded px-2 py-1"
                  value={selectedTime[order.id] || ""}
                  onChange={(e) =>
                    setSelectedTime((prev) => ({ ...prev, [order.id]: Number(e.target.value) }))
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
        ))}
      </div>
    </div>
  );
}
