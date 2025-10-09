import { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export default function Checkout({ orderId }) {
  const [order, setOrder] = useState(null);
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    // Listen for order changes in real-time
    const unsubscribe = onSnapshot(doc(db, "orders", orderId), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setOrder(data);

        if (data.status === "approved" && data.startTime && data.completionTime) {
          const endTime = data.startTime.toDate().getTime() + data.completionTime * 60 * 1000;

          const updateTimer = () => {
            const now = Date.now();
            const diff = endTime - now;
            setRemaining(diff > 0 ? diff : 0);
          };

          updateTimer();
          const interval = setInterval(updateTimer, 1000);
          return () => clearInterval(interval);
        } else {
          setRemaining(null);
        }
      }
    });

    return () => unsubscribe();
  }, [orderId]);

  const formatTime = (ms) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Order Status</h2>

      {!order && <p>Loading...</p>}

      {order && (
        <>
          <p>Status: <span className="font-medium">{order.status}</span></p>

          {order.status === "approved" && remaining !== null && (
            <p className="text-green-600 font-medium">
              Your order will be ready in {formatTime(remaining)}
            </p>
          )}

          {order.status === "rejected" && (
            <p className="text-red-600 font-medium">Sorry, your order was rejected.</p>
          )}

          {order.status === "completed" && (
            <p className="text-blue-600 font-medium">Your order is ready!</p>
          )}
        </>
      )}
    </div>
  );
}
