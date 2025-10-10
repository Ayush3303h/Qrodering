


import { useEffect, useState, useRef } from "react";
import { doc, onSnapshot, query, collection, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get("table");
  const orderIdFromState = location.state?.orderId;

  const [order, setOrder] = useState(null);
  const [remaining, setRemaining] = useState(null);
  const [playedSound, setPlayedSound] = useState(false);
  const audioRef = useRef(null);

  // Load order
  useEffect(() => {
    const fetchOrderByTable = async () => {
      if (!tableId) return;
      const q = query(
        collection(db, "orders"),
        where("tableId", "==", tableId),
        orderBy("createdAt", "desc"),
        limit(1)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setOrder({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      }
    };

    if (orderIdFromState) {
      // real-time listener for specific order
      const unsub = onSnapshot(doc(db, "orders", orderIdFromState), (snap) => {
        if (snap.exists()) setOrder({ id: snap.id, ...snap.data() });
      });
      return () => unsub();
    } else if (tableId) {
      fetchOrderByTable();
    }
  }, [orderIdFromState, tableId]);

  useEffect(() => {
    audioRef.current = new Audio("https://jmp.sh/miX8tm8e");
    audioRef.current.volume = 0.8;
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!order?.status || order.status !== "approved") {
      setRemaining(null);
      return;
    }
    if (!order.startTime || !order.completionTime) return;

    const endTime = order.startTime.toDate().getTime() + order.completionTime * 60 * 1000;
    const updateTimer = () => {
      const diff = endTime - Date.now();
      setRemaining(diff > 0 ? diff : 0);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [order?.status, order?.startTime, order?.completionTime]);

  useEffect(() => {
    if (!audioRef.current || playedSound) return;
    if ((order?.status === "approved" && remaining === 0) || order?.status === "completed") {
      audioRef.current.play().catch(() => {});
      setPlayedSound(true);
    }
  }, [remaining, order?.status, playedSound]);

  const formatTime = (ms) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  if (!order) return <div className="p-6 text-gray-500">Loading your order...</div>;

  return (
    <div className="p-6 space-y-4">
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-semibold">Order Status</h2>

      {/* Items */}
      {order.items && order.items.length > 0 && (
        <div className="border-t border-gray-200 pt-3 space-y-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-sm">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{((item?.price ?? item?.modifiers?.[0]?.option?.price ?? 0) * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Totals */}
      <div className="pt-3 border-t text-sm text-slate-600 space-y-1">
        <p className="flex justify-between"><span>Subtotal</span><span>₹{order.subtotal?.toFixed(2)}</span></p>
        <p className="flex justify-between"><span>Service Fee (5%)</span><span>₹{order.tax?.toFixed(2)}</span></p>
        <p className="flex justify-between font-semibold text-slate-800 text-base"><span>Total</span><span>₹{order.total?.toFixed(2)}</span></p>
      </div>

      {/* Status */}
      <div className="pt-4 border-t">
        {order.status === "pending" && <p className="text-slate-600 font-medium">⏳ Your order is being reviewed...</p>}
        {order.status === "approved" && remaining !== null && remaining > 0 && <p className="text-green-600 font-semibold">🍳 Your food will be ready in {formatTime(remaining)}</p>}
        {order.status === "approved" && remaining === 0 && <p className="text-blue-600 font-semibold">✅ Your order is ready!</p>}
        {order.status === "rejected" && <p className="text-red-600 font-medium">❌ Sorry, your order was rejected.</p>}
        {order.status === "completed" && <p className="text-blue-600 font-semibold">✅ Your order is ready for pickup!</p>}
      </div>
    </div>
  );
}
