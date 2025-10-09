
// Navbar.jsx
// import { Link, useNavigate } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import { useState } from "react";
// import CartPanel from "./CartPanel"; // New component

// export default function Navbar({ tableId }) {
//   const { cart } = useCart();
//   const [openCart, setOpenCart] = useState(false);
//   const navigate = useNavigate();

//   const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

//   return (
//     <header className="flex items-center justify-between px-6 py-4 sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-200 z-30">
//       <Link to="/" className="flex items-center gap-3">
//         <span className="text-2xl">🍽️</span>
//         <div>
//           <strong className="block text-lg">Streamline Dining</strong>
//           <p className="m-0 text-sm text-gray-500">Contactless ordering</p>
//         </div>
//       </Link>

//       <div className="flex items-center gap-4">
//         {tableId ? (
//           <span className="inline-flex items-center gap-1 text-sm rounded-full bg-emerald-100 text-emerald-500 px-4 py-1">
//             Table <strong>{tableId}</strong>
//           </span>
//         ) : (
//           <span className="inline-flex items-center gap-1 text-sm rounded-full bg-gray-100 text-gray-500 px-4 py-1">
//             Table not detected
//           </span>
//         )}

//         {/* Cart Icon */}
//         <button
//           onClick={() => setOpenCart(!openCart)}
//           className="relative bg-transparent hover:text-indigo-600"
//           aria-label="View cart"
//         >
//           🛒
//           {totalItems > 0 && (
//             <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full px-2">
//               {totalItems}
//             </span>
//           )}
//         </button>
//       </div>

//       {/* Cart dropdown/panel */}
//       {openCart && (
//         <CartPanel
//           onClose={() => setOpenCart(false)}
//           onCheckout={() => {
//             setOpenCart(false);
//             navigate("/checkout");
//           }}
//         />
//       )}
//     </header>
//   );
// }


// Navbar.jsx
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import CartPanel from "./CartPanel";

// export default function Navbar({ tableId }) {
//   const { cart } = useCart();
//   const [showCart, setShowCart] = useState(false);
//   const navigate = useNavigate();

//   const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

//   return (
//     <header className="flex items-center justify-between px-6 py-4 sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-200 z-30">
//       <div className="flex items-center gap-3">
//         <span className="text-2xl">🍽️</span>
//         <div>
//           <strong className="block text-lg">Streamline Dining</strong>
//           <p className="m-0 text-sm text-gray-500">Contactless ordering</p>
//         </div>
//       </div>

//       <div className="flex items-center gap-4">
//         {tableId ? (
//           <span className="inline-flex items-center gap-1 text-sm rounded-full bg-emerald-100 text-emerald-500 px-4 py-1">
//             Table <strong>{tableId}</strong>
//           </span>
//         ) : (
//           <span className="inline-flex items-center gap-1 text-sm rounded-full bg-gray-100 text-gray-500 px-4 py-1">
//             Table not detected
//           </span>
//         )}

//         {/* Cart Button */}
//         <button
//           onClick={() => setShowCart(!showCart)}
//           className="relative text-xl hover:text-indigo-600"
//           aria-label="Open cart"
//         >
//           🛒
//           {totalItems > 0 && (
//             <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full px-2">
//               {totalItems}
//             </span>
//           )}
//         </button>
//       </div>

//       {showCart && (
//         <CartPanel
//           onClose={() => setShowCart(false)}
//           onCheckout={() => {
//             setShowCart(false);
//             navigate("/checkout");
//           }}
//         />
//       )}
//     </header>
//   );
// }




import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartPanel from "./CartPanel";

export default function Navbar({ tableId }) {
  const { cart } = useCart();
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();

  // Total number of items in the cart
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="relative flex items-center justify-between px-6 py-4 sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-200 z-30">
      {/* Brand Logo / Title */}
      <div className="flex items-center gap-3">
        <span className="text-2xl">🍽️</span>
        <div>
          <strong className="block text-lg">Streamline Dining</strong>
          <p className="m-0 text-sm text-gray-500">Contactless ordering</p>
        </div>
      </div>

      {/* Right side: Table info and Cart button */}
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

        {/* Cart Button */}
        <button
          onClick={() => {
            console.log("Cart button clicked");
            setShowCart(!showCart);
          }}
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

      {/* Cart Panel */}
      {showCart && (
        <CartPanel
          onClose={() => setShowCart(false)}
          onCheckout={() => {
            setShowCart(false);
            navigate("/checkout");
          }}
        />
      )}
    </header>
  );
}
