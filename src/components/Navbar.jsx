


import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartPanel from "./CartPanel";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export default function Navbar({ tableId: propTableId }) {
  const { cart } = useCart();
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableId = propTableId || searchParams.get("table"); // detect table from URL

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleMyOrder = async () => {
    if (!tableId) {
      alert("No table detected.");
      return;
    }

    try {
      const q = query(
        collection(db, "orders"),
        where("tableId", "==", tableId),
        orderBy("createdAt", "desc"),
        limit(1)
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        alert("No order found for your table.");
        return;
      }
      const order = snapshot.docs[0];
      navigate("/checkout", { state: { orderId: order.id } });
    } catch (err) {
      console.error("Error fetching your order:", err);
      alert("Something went wrong while fetching your order.");
    }
  };

  return (
    <header className="relative flex items-center justify-between px-6 py-4 sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-200 z-30">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🍽️</span>
        <div>
          <strong className="block text-lg">Streamline Dining</strong>
          <p className="m-0 text-sm text-gray-500">Contactless ordering</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {tableId ? (
          <span className="inline-flex items-center gap-1 text-sm rounded-full bg-emerald-100 text-emerald-500 px-4 py-1">
            Table <strong>{tableId}</strong>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-sm rounded-full bg-gray-100 text-gray-500 px-4 py-1">
            Table not detected
          </span>
        )}

        <button
          onClick={handleMyOrder}
          className="text-sm px-3 py-1 bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200"
        >
          My Order
        </button>

        <button
          onClick={() => setShowCart(!showCart)}
          className="relative text-xl hover:text-indigo-600"
          aria-label="Open cart"
        >
          🛒
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full px-2">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {showCart && (
        <CartPanel
          onClose={() => setShowCart(false)}
          tableId={tableId} // pass tableId
          onCheckout={() => {
            setShowCart(false);
            navigate("/checkout");
          }}
        />
      )}
    </header>
  );
}
