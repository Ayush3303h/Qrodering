
// import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// import { db } from "../firebase/firebaseConfig";
// import { useCart } from "../context/CartContext";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";

// export default function CartPanel({ onClose, tableId }) {
//   const { cart, incrementItem, decrementItem, removeFromCart, clearCart } = useCart();
//   const navigate = useNavigate();

//   const subtotal = cart.reduce(
//     (sum, item) =>
//       sum + ((item?.modifiers?.[0]?.option?.price ?? item?.price ?? 0) * (item?.quantity || 0)),
//     0
//   );
//   const tax = subtotal * 0.05;
//   const total = subtotal + tax;

//   const handlePlaceOrder = async () => {
//     if (cart.length === 0) {
//       alert("Your cart is empty!");
//       return;
//     }
//     try {
//       const orderData = {
//         items: cart,
//         subtotal,
//         tax,
//         total,
//         status: "pending",
//         createdAt: serverTimestamp(),
//         tableId: tableId || null,
//       };
//       const docRef = await addDoc(collection(db, "orders"), orderData);
//       navigate("/checkout", { state: { orderId: docRef.id } });
//       onClose();
//       clearCart();
//     } catch (error) {
//       console.error("Error placing order:", error);
//       alert("Something went wrong while placing the order. Please try again.");
//     }
//   };

//   return (
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0, x: 100 }}
//         animate={{ opacity: 1, x: 0 }}
//         exit={{ opacity: 0, x: 100 }}
//         transition={{ duration: 0.3 }}
//         className="absolute right-4 top-16 w-80 bg-white rounded-3xl shadow-2xl border border-gray-200 p-5 z-40"
//       >
//         {/* Header */}
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-bold text-gray-800">Your Cart</h3>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-700 transition"
//           >
//             ✕
//           </button>
//         </div>

//         {/* Cart Items */}
//         {cart.length === 0 ? (
//           <div className="text-center text-gray-400 py-6">Your cart is empty</div>
//         ) : (
//           <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
//             {cart.map((item) => {
//               const price = item?.modifiers?.[0]?.option?.price ?? item?.price ?? 0;
//               return (
//                 <motion.div
//                   key={item.id}
//                   className="flex items-center gap-3 border-b border-gray-100 pb-2 hover:bg-gray-50 rounded-lg p-1 transition"
//                   layout
//                 >
//                   <img
//                     src={item.imageURL || "/placeholder.jpg"}
//                     alt={item.name || "Menu Item"}
//                     className="w-14 h-14 object-cover rounded-xl shadow-sm"
//                   />
//                   <div className="flex-1">
//                     <p className="text-sm font-medium text-gray-800">{item?.name || "Unnamed Item"}</p>
//                     <p className="text-xs text-gray-500">₹{price}</p>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <button
//                       onClick={() => decrementItem(item.id)}
//                       className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 transition"
//                     >
//                       −
//                     </button>
//                     <span>{item?.quantity || 0}</span>
//                     <button
//                       onClick={() => incrementItem(item.id)}
//                       className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 transition"
//                     >
//                       +
//                     </button>
//                     <button
//                       onClick={() => removeFromCart(item.id)}
//                       className="text-red-500 hover:text-red-600 ml-1 transition"
//                     >
//                       ×
//                     </button>
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </div>
//         )}

//         {/* Totals */}
//         {cart.length > 0 && (
//           <div className="mt-4 border-t border-gray-200 pt-4 space-y-2 text-sm">
//             <div className="flex justify-between text-gray-600">
//               <span>Subtotal</span>
//               <span>₹{subtotal.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between text-gray-600">
//               <span>Service Fee (5%)</span>
//               <span>₹{tax.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between font-semibold text-gray-900 text-lg border-t border-gray-200 pt-2">
//               <span>Total</span>
//               <span>₹{total.toFixed(2)}</span>
//             </div>

//             <button
//               onClick={handlePlaceOrder}
//               className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl py-2 font-semibold shadow-lg transition-all"
//             >
//               Place Order
//             </button>
//           </div>
//         )}
//       </motion.div>
//     </AnimatePresence>
//   );
// }








import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPanel({ onClose, tableId }) {
  const { cart, incrementItem, decrementItem, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + ((item?.modifiers?.[0]?.option?.price ?? item?.price ?? 0) * (item?.quantity || 0)),
    0
  );
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      const orderData = {
        items: cart,
        subtotal,
        tax,
        total,
        status: "pending",
        createdAt: serverTimestamp(),
        tableId: tableId || null,
      };

      const docRef = await addDoc(collection(db, "orders"), orderData);

      navigate("/checkout", { state: { orderId: docRef.id } });
      onClose();
      clearCart();
      console.log("Order created with ID:", docRef.id);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Something went wrong while placing the order. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {cart && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3 }}
          className="absolute right-4 top-16 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 p-5 z-40"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Your Cart</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              ✕
            </button>
          </div>

          {/* Cart Items */}
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 py-6">Your cart is empty</div>
          ) : (
            <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item, idx) => {
                const price = item?.modifiers?.[0]?.option?.price ?? item?.price ?? 0;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-3 border-b border-gray-100 pb-2 hover:shadow-md rounded-md p-1 transition-shadow"
                  >
                    <img
                      src={item.imageURL || "/placeholder.jpg"}
                      alt={item.name || "Menu Item"}
                      className="w-12 h-12 object-cover rounded transition-transform duration-300 hover:scale-105"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item?.name || "Unnamed Item"}</p>
                      <p className="text-xs text-gray-500">₹{price}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => decrementItem(item.id)}
                        className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 transition"
                      >
                        −
                      </button>
                      <span>{item?.quantity || 0}</span>
                      <button
                        onClick={() => incrementItem(item.id)}
                        className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 transition"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-600 ml-1 transition"
                      >
                        ×
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Totals */}
          {cart.length > 0 && (
            <div className="mt-4 border-t border-gray-200 pt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Service fee (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-gray-800">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md py-2 font-medium shadow-lg transition-all"
              >
                Place Order
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
