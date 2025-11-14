// import { useEffect, useMemo, useState } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../firebase/firebaseConfig";
// import { useCart } from "../context/CartContext";
// import { motion } from "framer-motion";
// import { useParams } from "react-router-dom";

// const FALLBACK_IMAGE =
//   "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=640&q=80";

// export default function MenuList() {
//   const { restaurantSlug } = useParams();
//   const [menu, setMenu] = useState([]);
//   const [status, setStatus] = useState("idle");
//   const [error, setError] = useState(null);
//   const [activeCategory, setActiveCategory] = useState("all");
//   const { cart, addToCart, incrementItem, decrementItem } = useCart();

//   useEffect(() => {
//     const fetchMenu = async () => {
//       try {
//         setStatus("loading");
//         const snapshot = await getDocs(collection(db, "restaurants", restaurantSlug, "menu"));
//         const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
//         setMenu(data);
//         setStatus("success");
//       } catch (err) {
//         setError(err.message);
//         setStatus("error");
//       }
//     };
//     if (restaurantSlug) fetchMenu();
//   }, [restaurantSlug]);

//   const categories = useMemo(() => {
//     const set = new Set(menu.map((m) => m.category || "Other"));
//     return ["all", ...Array.from(set)];
//   }, [menu]);

//   const filteredMenu =
//     activeCategory === "all"
//       ? menu
//       : menu.filter((i) => (i.category || "Other") === activeCategory);

//   return (
//     <section className="flex flex-col gap-6">
//       <header className="flex flex-wrap justify-between gap-4 items-center">
//         <h2 className="text-2xl font-semibold">Our Menu</h2>
//         <div className="flex gap-2">
//           {categories.map((cat) => (
//             <button
//               key={cat}
//               onClick={() => setActiveCategory(cat)}
//               className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
//                 activeCategory === cat
//                   ? "bg-indigo-600 text-white"
//                   : "bg-gray-100 text-gray-600 hover:bg-indigo-600 hover:text-white"
//               }`}
//             >
//               {cat === "all" ? "All" : cat}
//             </button>
//           ))}
//         </div>
//       </header>

//       {status === "loading" && <div>Loading menu…</div>}
//       {status === "error" && <div>Error: {error}</div>}

//       <ul className="divide-y divide-gray-200">
//         {filteredMenu.map((item) => {
//           const found = cart.find((c) => c.id === item.id);
//           const qty = found ? found.quantity : 0;
//           return (
//             <motion.li
//               key={item.id}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.2 }}
//               className="flex items-start gap-4 py-4"
//             >
//               <img
//                 src={item.imageURL || FALLBACK_IMAGE}
//                 alt={item.name}
//                 className="w-24 h-24 rounded-md object-cover border"
//               />
//               <div className="flex-1">
//                 <h3 className="font-medium">{item.name}</h3>
//                 <p>₹{item.price}</p>
//                 <p className="text-sm text-gray-600">{item.description}</p>
//               </div>
//               <div className="flex items-center">
//                 {qty === 0 ? (
//                   <button
//                     onClick={() => addToCart(item)}
//                     className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
//                   >
//                     Add
//                   </button>
//                 ) : (
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => decrementItem(item.id)}
//                       className="w-8 h-8 bg-gray-100 rounded-md"
//                     >
//                       −
//                     </button>
//                     <span>{qty}</span>
//                     <button
//                       onClick={() => incrementItem(item.id)}
//                       className="w-8 h-8 bg-gray-100 rounded-md"
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













// import { useEffect, useMemo, useState } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../firebase/firebaseConfig";
// import { useCart } from "../context/CartContext";
// import { motion } from "framer-motion";
// import { useParams } from "react-router-dom";

// const FALLBACK_IMAGE =
//   "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=640&q=80";

// export default function MenuList() {
//   const { restaurantSlug } = useParams();
//   const [menu, setMenu] = useState([]);
//   const [status, setStatus] = useState("idle");
//   const [error, setError] = useState(null);
//   const [activeCategory, setActiveCategory] = useState("all");
//   const { cart, addToCart, incrementItem, decrementItem } = useCart();

//   useEffect(() => {
//     const fetchMenu = async () => {
//       try {
//         setStatus("loading");
//         const snapshot = await getDocs(collection(db, "restaurants", restaurantSlug, "menu"));
//         const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
//         setMenu(data);
//         setStatus("success");
//       } catch (err) {
//         setError(err.message);
//         setStatus("error");
//       }
//     };
//     if (restaurantSlug) fetchMenu();
//   }, [restaurantSlug]);

//   const categories = useMemo(() => {
//     const set = new Set(menu.map((m) => m.category || "Other"));
//     return ["all", ...Array.from(set)];
//   }, [menu]);

//   const filteredMenu =
//     activeCategory === "all"
//       ? menu
//       : menu.filter((i) => (i.category || "Other") === activeCategory);

//   return (
//     <section className="flex flex-col gap-6">
//       <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <h2 className="text-2xl font-semibold">Our Menu</h2>

//         {/* Category pills - horizontal, scrollable on small screens */}
//         <div className="w-full sm:w-auto">
//           <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap py-1 px-1">
//             {categories.map((cat) => {
//               const isActive = activeCategory === cat;
//               return (
//                 <button
//                   key={cat}
//                   onClick={() => setActiveCategory(cat)}
//                   className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all select-none focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
//                     isActive
//                       ? "bg-indigo-600 text-white shadow-md"
//                       : "bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
//                   }`}
//                 >
//                   {cat === "all" ? "All" : cat}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </header>

//       {status === "loading" && <div>Loading menu…</div>}
//       {status === "error" && <div>Error: {error}</div>}

//       {/* Grid of menu cards - keeps same functionality but better visuals */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredMenu.map((item) => {
//           const found = cart.find((c) => c.id === item.id);
//           const qty = found ? found.quantity : 0;

//           return (
//             <motion.article
//               key={item.id}
//               initial={{ opacity: 0, y: 8 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.18 }}
//               className="relative bg-white rounded-2xl shadow-sm hover:shadow-md overflow-hidden border border-transparent hover:border-gray-100 p-0"
//             >
//               <div className="flex flex-col h-full">
//                 <div className="relative w-full h-44 bg-gray-50">
//                   <img
//                     src={item.imageURL || FALLBACK_IMAGE}
//                     alt={item.name}
//                     className="w-full h-full object-cover"
//                   />

//                   {/* badges */}
//                   <div className="absolute top-3 left-3 flex gap-2">
//                     {item.veg && (
//                       <span className="bg-white/80 text-green-700 text-xs font-semibold px-2 py-1 rounded-md">Veg</span>
//                     )}
//                     {item.spicy && (
//                       <span className="bg-white/80 text-red-600 text-xs font-semibold px-2 py-1 rounded-md">Spicy</span>
//                     )}
//                   </div>
//                 </div>

//                 <div className="p-4 flex-1 flex flex-col justify-between">
//                   <div>
//                     <div className="flex items-start justify-between gap-3">
//                       <h3 className="font-medium text-gray-900 line-clamp-2">{item.name}</h3>
//                       <div className="text-indigo-600 font-semibold">₹{item.price}</div>
//                     </div>

//                     <p className="mt-2 text-sm text-gray-600 max-h-14 overflow-hidden">{item.description}</p>

//                     <p className="mt-3 text-xs text-gray-400">{item.category}</p>
//                   </div>

//                   <div className="mt-4 flex items-center justify-end gap-3">
//                     {qty === 0 ? (
//                       <button
//                         onClick={() => addToCart(item)}
//                         className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium"
//                       >
//                         Add
//                       </button>
//                     ) : (
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => decrementItem(item.id)}
//                           className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-lg"
//                         >
//                           −
//                         </button>
//                         <span className="w-6 text-center">{qty}</span>
//                         <button
//                           onClick={() => incrementItem(item.id)}
//                           className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-lg"
//                         >
//                           +
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </motion.article>
//           );
//         })}
//       </div>
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
    const map = new Map();
    for (const it of menu) {
      const cat = (it.category || "Uncategorized").trim();
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat).push(it);
    }
    return Array.from(map.entries()).map(([name, items]) => ({ name, items }));
  }, [menu]);

  const [openMap, setOpenMap] = useState(() =>
    Object.fromEntries(categories.map((c) => [c.name, false]))
  );

  useEffect(() => {
    setOpenMap((prev) => {
      const next = {};
      for (const c of categories) next[c.name] = prev[c.name] ?? false;
      return next;
    });
  }, [categories]);

  const toggleCategory = (name) =>
    setOpenMap((prev) => ({ ...prev, [name]: !prev[name] }));

  if (status === "loading") return <div className="p-6 text-center">Loading menu…</div>;
  if (status === "error") return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  if (!menu.length) return <div className="p-6 text-center text-gray-500">No menu items available.</div>;

  return (
    <section className="space-y-6 px-4 sm:px-6">
      <header className="pt-4 pb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Menu</h1>
        <p className="text-sm text-gray-500 mt-1">Tap a category to expand — then add items to your cart.</p>
      </header>

      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat.name} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <button
              onClick={() => toggleCategory(cat.name)}
              className="w-full flex items-center justify-between gap-4 p-5 text-left focus:outline-none"
              aria-expanded={!!openMap[cat.name]}
            >
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{cat.name}</h2>
                <div className="text-sm text-gray-500 mt-1">{cat.items.length} items</div>
              </div>
              <div className="flex items-center gap-3">
                <svg
                  className={`w-5 h-5 text-gray-400 transform transition-transform ${openMap[cat.name] ? "rotate-180" : "rotate-0"}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z" clipRule="evenodd" />
                </svg>
              </div>
            </button>

            <div className="border-t border-gray-100" />

            <div className={`${openMap[cat.name] ? "block" : "hidden"} divide-y divide-gray-100`}>
              {cat.items.map((item) => {
                const found = cart.find((c) => c.id === item.id);
                const qty = found ? found.quantity : 0;
                return (
                  <motion.article
                    key={item.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.12 }}
                    className="p-4 sm:p-5 flex gap-4 items-start relative"
                  >
                    {/* Left: text */}
                    <div className="flex-1 min-w-0 pr-4">
                      <h3 className="font-medium text-gray-900 text-lg">{item.name}</h3>
                      <p className="text-sm text-gray-600 mt-2">{item.description}</p>

                      {/* price aligned to left under description */}
                      <div className="mt-4 text-indigo-600 font-semibold">₹{item.price}</div>
                    </div>

                    {/* Right: image */}
                    <div className="w-28 h-20 sm:w-32 sm:h-24 relative flex-shrink-0">
                      <img
                        src={item.imageURL || FALLBACK_IMAGE}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg border"
                      />

                      {/* Add button positioned bottom-right of the card, placed below image (no overlap) */}
                      <div className="absolute right-0 -bottom-10 sm:-bottom-12">
                        {qty === 0 ? (
                          <button onClick={() => addToCart(item)} className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm shadow">Add</button>
                        ) : (
                          <div className="flex items-center gap-2 bg-white p-1 rounded-md shadow">
                            <button onClick={() => decrementItem(item.id)} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">−</button>
                            <span>{qty}</span>
                            <button onClick={() => incrementItem(item.id)} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">+</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="h-12" />
    </section>
  );
}