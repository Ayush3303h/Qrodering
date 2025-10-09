
// import { useCart } from "../context/CartContext";

// export default function CartPanel({ onClose, onCheckout }) {
//   const { cart, incrementItem, decrementItem, removeFromCart } = useCart();

//   // ✅ Safely calculate subtotal with fallback
//   const subtotal = cart.reduce((sum, item) => {
//     const price =
//       item?.modifiers?.[0]?.option?.price ?? // use modifiers if available
//       item?.price ??                        // fallback to direct price
//       0;
//     return sum + price * (item?.quantity || 0);
//   }, 0);

//   const tax = subtotal * 0.05;
//   const total = subtotal + tax;

//   return (
//     <div className="absolute right-4 top-16 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 z-40">
//       <div className="flex justify-between items-center mb-3">
//         <h3 className="text-lg font-semibold">Your Cart</h3>
//         <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//           ✕
//         </button>
//       </div>

//       {cart.length === 0 ? (
//         <div className="text-center text-gray-500 py-6">Your cart is empty</div>
//       ) : (
//         <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
//           {cart.map((item) => {
//             const price =
//               item?.modifiers?.[0]?.option?.price ?? item?.price ?? 0;

//             return (
//               <div
//                 key={item.id}
//                 className="flex items-center gap-3 border-b border-gray-100 pb-2"
//               >
//                 <img
//                   src={item.imageURL || "/placeholder.jpg"}
//                   alt={item.name || "Menu Item"}
//                   className="w-12 h-12 object-cover rounded"
//                 />
//                 <div className="flex-1">
//                   <p className="text-sm font-medium">{item?.name || "Unnamed Item"}</p>
//                   <p className="text-xs text-gray-500">₹{price}</p>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <button
//                     onClick={() => decrementItem(item.id)}
//                     className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200"
//                   >
//                     −
//                   </button>
//                   <span>{item?.quantity || 0}</span>
//                   <button
//                     onClick={() => incrementItem(item.id)}
//                     className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200"
//                   >
//                     +
//                   </button>
//                   <button
//                     onClick={() => removeFromCart(item.id)}
//                     className="text-red-500 hover:text-red-600 ml-1"
//                   >
//                     ×
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {cart.length > 0 && (
//         <div className="mt-3 border-t border-gray-200 pt-3 space-y-1 text-sm">
//           <div className="flex justify-between">
//             <span>Subtotal</span>
//             <span>₹{subtotal.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Service fee (5%)</span>
//             <span>₹{tax.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between font-semibold text-gray-800">
//             <span>Total</span>
//             <span>₹{total.toFixed(2)}</span>
//           </div>
//           <button
//             onClick={onCheckout}
//             className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md py-2 font-medium"
//           >
//             Place Order
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }






import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartPanel({ onClose }) {
  const { cart, incrementItem, decrementItem, removeFromCart } = useCart();
  const navigate = useNavigate();

  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      ((item?.modifiers?.[0]?.option?.price ?? item?.price ?? 0) *
        (item?.quantity || 0)),
    0
  );
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  return (
    <div className="absolute right-4 top-16 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 z-40">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Your Cart</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* Cart Items */}
      {cart.length === 0 ? (
        <div className="text-center text-gray-500 py-6">
          Your cart is empty
        </div>
      ) : (
        <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
          {cart.map((item) => {
            const price =
              item?.modifiers?.[0]?.option?.price ?? item?.price ?? 0;

            return (
              <div
                key={item.id}
                className="flex items-center gap-3 border-b border-gray-100 pb-2"
              >
                <img
                  src={item.imageURL || "/placeholder.jpg"}
                  alt={item.name || "Menu Item"}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {item?.name || "Unnamed Item"}
                  </p>
                  <p className="text-xs text-gray-500">₹{price}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => decrementItem(item.id)}
                    className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200"
                  >
                    −
                  </button>
                  <span>{item?.quantity || 0}</span>
                  <button
                    onClick={() => incrementItem(item.id)}
                    className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-600 ml-1"
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Totals */}
      {cart.length > 0 && (
        <div className="mt-3 border-t border-gray-200 pt-3 space-y-1 text-sm">
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

          {/* ✅ Fixed Navigation */}
          <button
            onClick={() => {
              onClose();
              // Pass a dummy orderId to avoid undefined errors
              navigate("/checkout", { state: { orderId: "dummy123" } });
            }}
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md py-2 font-medium"
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
}
