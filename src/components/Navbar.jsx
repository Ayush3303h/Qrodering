


// import { useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import CartPanel from "./CartPanel";
// import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
// import { db } from "../firebase/firebaseConfig";
// import { motion, AnimatePresence } from "framer-motion";

// export default function Navbar({ tableId: propTableId }) {
//   const { cart } = useCart();
//   const [showCart, setShowCart] = useState(false);
//   const [mobileMenu, setMobileMenu] = useState(false);
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const tableId = propTableId || searchParams.get("table");

//   const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

//   const handleMyOrder = async () => {
//     if (!tableId) {
//       alert("No table detected.");
//       return;
//     }
//     try {
//       const q = query(
//         collection(db, "orders"),
//         where("tableId", "==", tableId),
//         orderBy("createdAt", "desc"),
//         limit(1)
//       );
//       const snapshot = await getDocs(q);
//       if (snapshot.empty) {
//         alert("No order found for your table.");
//         return;
//       }
//       const order = snapshot.docs[0];
//       navigate("/checkout", { state: { orderId: order.id } });
//     } catch (err) {
//       console.error("Error fetching your order:", err);
//       alert("Something went wrong while fetching your order.");
//     }
//   };

//   return (
//     <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16 items-center">
//           {/* Logo */}
//           <div className="flex items-center gap-3">
//             <span className="text-3xl animate-pulse">🍽️</span>
//             <div>
//               <strong className="block text-xl text-indigo-600 font-bold tracking-wide">Streake</strong>
//               <p className="text-sm text-gray-400">Contactless Ordering</p>
//             </div>
//           </div>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex items-center gap-4">
//             {tableId ? (
//               <span className="inline-flex items-center gap-1 text-sm font-medium rounded-full bg-emerald-100 text-emerald-700 px-4 py-1 shadow-sm">
//                 Table <strong>{tableId}</strong>
//               </span>
//             ) : (
//               <span className="inline-flex items-center gap-1 text-sm font-medium rounded-full bg-gray-100 text-gray-500 px-4 py-1 shadow-sm">
//                 Table not detected
//               </span>
//             )}

//             <button
//               onClick={handleMyOrder}
//               className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-2xl shadow hover:bg-indigo-700 transition-all"
//             >
//               My Order
//             </button>

//             <button
//               onClick={() => setShowCart(!showCart)}
//               className="relative text-2xl hover:text-indigo-600 transition-all"
//               aria-label="Open cart"
//             >
//               🛒
//               {totalItems > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
//                   {totalItems}
//                 </span>
//               )}
//             </button>
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="flex md:hidden items-center gap-2">
//             <button
//               onClick={() => setMobileMenu(!mobileMenu)}
//               className="text-2xl hover:text-indigo-600"
//               aria-label="Toggle menu"
//             >
//               ☰
//             </button>
//             <button
//               onClick={() => setShowCart(!showCart)}
//               className="relative text-2xl hover:text-indigo-600"
//               aria-label="Open cart"
//             >
//               🛒
//               {totalItems > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
//                   {totalItems}
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <AnimatePresence>
//         {mobileMenu && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             transition={{ duration: 0.2 }}
//             className="md:hidden px-4 pb-4 flex flex-col gap-3 bg-white/95 border-t border-gray-200 shadow-md"
//           >
//             {tableId ? (
//               <span className="inline-flex items-center gap-1 text-sm font-medium rounded-full bg-emerald-100 text-emerald-700 px-4 py-1 shadow-sm">
//                 Table <strong>{tableId}</strong>
//               </span>
//             ) : (
//               <span className="inline-flex items-center gap-1 text-sm font-medium rounded-full bg-gray-100 text-gray-500 px-4 py-1 shadow-sm">
//                 Table not detected
//               </span>
//             )}
//             <button
//               onClick={handleMyOrder}
//               className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-2xl shadow hover:bg-indigo-700 transition-all"
//             >
//               My Order
//             </button>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Cart Panel */}
//       <AnimatePresence>
//         {showCart && (
//           <CartPanel
//             onClose={() => setShowCart(false)}
//             tableId={tableId}
//             onCheckout={() => {
//               setShowCart(false);
//               navigate("/checkout");
//             }}
//           />
//         )}
//       </AnimatePresence>
//     </header>
//   );
// }








import { useState } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartPanel from "./CartPanel";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { restaurantSlug } = useParams();
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get("table");
  const { cart } = useCart();
  const navigate = useNavigate();
  const [showCart, setShowCart] = useState(false);

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  const handleMyOrder = async () => {
    if (!tableId) return alert("No table detected");
    const q = query(
      collection(db, "restaurants", restaurantSlug, "orders"),
      where("tableId", "==", tableId),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return alert("No order found");
    navigate(`/${restaurantSlug}/checkout`, { state: { orderId: snap.docs[0].id } });
  };

  return (
    <header className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm z-30">
      <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🍽️</span>
          <strong className="text-indigo-600 text-xl font-bold">Streake</strong>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleMyOrder}
            className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-2xl shadow hover:bg-indigo-700"
          >
            My Order
          </button>
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative text-2xl hover:text-indigo-600"
          >
            🛒
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showCart && (
          <CartPanel
            onClose={() => setShowCart(false)}
            tableId={tableId}
            restaurantSlug={restaurantSlug}
          />
        )}
      </AnimatePresence>
    </header>
  );
}
