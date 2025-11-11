

// import { useEffect, useMemo, useState } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../firebase/firebaseConfig";
// import { useCart } from "../context/CartContext";
// import { motion } from "framer-motion";

// const FALLBACK_IMAGE =
//   "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=640&q=80";

// export default function MenuList({ tableId }) {
//   const [menu, setMenu] = useState([]);
//   const [status, setStatus] = useState("idle");
//   const [error, setError] = useState(null);
//   const [activeCategory, setActiveCategory] = useState("all");
//   const { cart, addToCart, incrementItem, decrementItem } = useCart();

//   const subtitle = tableId
//     ? `Curated for table ${tableId}.`
//     : "Pick from our seasonal menu crafted for your table.";

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setStatus("loading");
//         const snapshot = await getDocs(collection(db, "menu"));
//         const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//         setMenu(data);
//         setStatus("success");
//       } catch (err) {
//         console.error(err);
//         setError(err.message);
//         setStatus("error");
//       }
//     };
//     fetchData();
//   }, []);

//   const categories = useMemo(() => {
//     const set = new Set(menu.map((item) => item?.category || "Other"));
//     return ["all", ...Array.from(set)];
//   }, [menu]);

//   const filteredMenu = useMemo(() => {
//     if (activeCategory === "all") return menu;
//     return menu.filter((item) => (item?.category || "Other") === activeCategory);
//   }, [menu, activeCategory]);

//   const getCartQuantity = (id) => {
//     const found = cart.find((c) => c.id === id);
//     return found ? found.quantity : 0;
//   };

//   return (
//     <section className="flex flex-col gap-6">
//       {/* Header */}
//       <header className="flex flex-wrap justify-between gap-4 items-center">
//         <div>
//           <h2 className="m-0 text-2xl font-semibold">Our Menu</h2>
//           <p className="mt-1 text-slate-500">{subtitle}</p>
//         </div>
//         <div className="flex flex-wrap gap-2" role="tablist">
//           {categories.map((cat) => (
//             <button
//               key={cat}
//               onClick={() => setActiveCategory(cat)}
//               className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
//                 activeCategory === cat
//                   ? "bg-indigo-600 text-white shadow-lg"
//                   : "bg-gray-100 text-gray-600 hover:bg-indigo-600 hover:text-white"
//               }`}
//             >
//               {cat === "all" ? "All" : cat}
//             </button>
//           ))}
//         </div>
//       </header>

//       {/* Status Messages */}
//       {status === "loading" && (
//         <div className="p-4 rounded-md bg-gray-100 text-gray-500">Loading the menu…</div>
//       )}
//       {status === "error" && (
//         <div className="p-4 rounded-md bg-red-100 text-red-600">Error: {error}</div>
//       )}
//       {status === "success" && filteredMenu.length === 0 && (
//         <div className="p-4 rounded-md bg-gray-100 text-gray-500">No dishes in this category yet.</div>
//       )}

//       {/* Menu List */}
//       <ul className="divide-y divide-gray-200">
//         {filteredMenu.map((item, index) => {
//           const quantity = getCartQuantity(item.id);
//           return (
//             <motion.li
//               key={item.id}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.03, duration: 0.3 }}
//               whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.08)" }}
//               className="flex items-start gap-4 py-4 transition-all duration-200"
//             >
//               {/* Image */}
//               <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden border border-gray-200">
//                 <img
//                   src={item.imageURL || FALLBACK_IMAGE}
//                   alt={item.name}
//                   className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
//                   onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
//                 />
//               </div>

//               {/* Content */}
//               <div className="flex-1">
//                 <h3 className="m-0 text-lg font-medium">{item.name}</h3>
//                 {item.price && (
//                   <p className="m-0 mt-1 text-base font-semibold text-gray-800">
//                     ₹{item.price.toFixed(2)}
//                   </p>
//                 )}
//                 <p className="m-0 mt-1 text-sm text-gray-600 line-clamp-2">{item.description}</p>
//               </div>

//               {/* Add to cart / Quantity control */}
//               <div className="flex items-center">
//                 {quantity === 0 ? (
//                   <button
//                     onClick={() => addToCart(item)}
//                     className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-semibold shadow transition-all duration-300"
//                   >
//                     Add to Cart
//                   </button>
//                 ) : (
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => decrementItem(item.id)}
//                       className="w-8 h-8 rounded-md bg-gray-100 hover:bg-gray-200 text-lg font-bold"
//                     >
//                       −
//                     </button>
//                     <span className="min-w-[24px] text-center">{quantity}</span>
//                     <button
//                       onClick={() => incrementItem(item.id)}
//                       className="w-8 h-8 rounded-md bg-gray-100 hover:bg-gray-200 text-lg font-bold"
//                     >
//                       +
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </motion.li>
//           );
//         })}
//       </ul>
//     </section>
//   );
// }







import { useEffect, useMemo, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=640&q=80";

export default function MenuList() {
  const { restaurantSlug } = useParams();
  const [menu, setMenu] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const { cart, addToCart, incrementItem, decrementItem } = useCart();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setStatus("loading");
        const snapshot = await getDocs(collection(db, "restaurants", restaurantSlug, "menu"));
        const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setMenu(data);
        setStatus("success");
      } catch (err) {
        setError(err.message);
        setStatus("error");
      }
    };
    if (restaurantSlug) fetchMenu();
  }, [restaurantSlug]);

  const categories = useMemo(() => {
    const set = new Set(menu.map((m) => m.category || "Other"));
    return ["all", ...Array.from(set)];
  }, [menu]);

  const filteredMenu =
    activeCategory === "all"
      ? menu
      : menu.filter((i) => (i.category || "Other") === activeCategory);

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-wrap justify-between gap-4 items-center">
        <h2 className="text-2xl font-semibold">Our Menu</h2>
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-indigo-600 hover:text-white"
              }`}
            >
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>
      </header>

      {status === "loading" && <div>Loading menu…</div>}
      {status === "error" && <div>Error: {error}</div>}

      <ul className="divide-y divide-gray-200">
        {filteredMenu.map((item) => {
          const found = cart.find((c) => c.id === item.id);
          const qty = found ? found.quantity : 0;
          return (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-4 py-4"
            >
              <img
                src={item.imageURL || FALLBACK_IMAGE}
                alt={item.name}
                className="w-24 h-24 rounded-md object-cover border"
              />
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p>₹{item.price}</p>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <div className="flex items-center">
                {qty === 0 ? (
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
                  >
                    Add
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decrementItem(item.id)}
                      className="w-8 h-8 bg-gray-100 rounded-md"
                    >
                      −
                    </button>
                    <span>{qty}</span>
                    <button
                      onClick={() => incrementItem(item.id)}
                      className="w-8 h-8 bg-gray-100 rounded-md"
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
