




// import { BrowserRouter, Routes, Route, useSearchParams } from "react-router-dom";
// import { motion } from "framer-motion";
// import MenuList from "./components/MenuList";
// import Checkout from "./components/Checkout";
// import QRTableDetector from "./components/QRTableDetector";
// import AdminDashboard from "./components/AdminDashboard";
// import Navbar from "./components/Navbar";
// import { CartProvider } from "./context/CartContext";

// function GuestExperience() {
//   const [searchParams] = useSearchParams();
//   const tableId = searchParams.get("table") || null;

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 via-white to-indigo-50">
//       {/* Navbar */}
//       <Navbar tableId={tableId} />

//       <main className="flex-1 px-4 sm:px-6 lg:px-12 py-12 flex flex-col gap-12">
//         {/* Hero Section */}
//         <motion.section
//           initial={{ opacity: 0, y: -40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-white rounded-3xl p-10 shadow-lg"
//         >
//           <div>
//             <span className="inline-block text-xs tracking-wider uppercase font-semibold text-indigo-500 bg-indigo-100 px-4 py-2 rounded-full mb-4">
//               Smart Dining
//             </span>
//             <h1 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight mb-4">
//               Order delicious food directly from your table
//             </h1>
//             <p className="text-gray-600 text-lg md:text-xl max-w-xl">
//               Scan the QR code, explore the menu, and place your order without waiting for staff. Enjoy a seamless dining experience with Streake.
//             </p>
//           </div>
//           <motion.img
//             src="/hero-food.png"
//             alt="Delicious food"
//             className="w-full rounded-2xl shadow-2xl object-cover"
//             initial={{ scale: 0.95, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{ duration: 1, delay: 0.3 }}
//           />
//         </motion.section>

//         {/* QR Detector + Menu */}
//         <motion.section
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.3 }}
//           className="flex flex-col gap-8"
//         >
//           <QRTableDetector tableId={tableId} />
//           <MenuList tableId={tableId} />
//         </motion.section>
//       </main>

//       {/* Footer */}
//       <motion.footer
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 1, delay: 0.5 }}
//         className="text-center py-6 text-gray-500 text-sm"
//       >
//         © {new Date().getFullYear()} Streake ✨ – Experience the future of dining
//       </motion.footer>
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <CartProvider>
//         <Routes>
//           <Route path="/" element={<GuestExperience />} />
//           <Route path="/checkout" element={<Checkout />} />
//           <Route path="/admin" element={<AdminDashboard />} />
//         </Routes>
//       </CartProvider>
//     </BrowserRouter>
//   );
// }











import { BrowserRouter, Routes, Route, useSearchParams } from "react-router-dom";
import MenuList from "./components/MenuList";
import Checkout from "./components/Checkout";
import QRTableDetector from "./components/QRTableDetector";
import AdminDashboard from "./components/AdminDashboard";
import Navbar from "./components/Navbar";
import { CartProvider } from "./context/CartContext";
import { motion } from "framer-motion";
import HeroFood from "./Gemini_Generated_Image_sqiaposqiaposqia.png";

function GuestExperience() {
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get("table") || null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 to-gray-100">
      <Navbar tableId={tableId} />

      <main className="flex-1 px-[clamp(1rem,5vw,4rem)] py-12 flex flex-col gap-12">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-12 items-center bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-[24px] p-[clamp(2rem,5vw,3rem)] shadow-xl"
        >
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 uppercase text-xs tracking-wider bg-orange-100 text-orange-600 px-4 py-2 rounded-full mb-2 font-medium shadow-sm"
            >
              Smart Dining
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-[clamp(2rem,4vw,3rem)] font-bold leading-tight text-gray-900"
            >
              Order delicious food right from your table
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-4 text-gray-600 max-w-[36ch]"
            >
              Scan the QR code, explore our curated menu, and place your order seamlessly. Your culinary experience begins here.
            </motion.p>
          </div>

          {/* Hero Image / Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="w-full flex justify-center"
          >
            <img
              src={HeroFood}
              alt="Delicious Food"
              className="w-full max-w-sm rounded-2xl shadow-2xl object-cover"
            />
          </motion.div>
        </motion.section>

        {/* Menu Section */}
        <section className="flex flex-col gap-6">
          <QRTableDetector tableId={tableId} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <MenuList tableId={tableId} />
          </motion.div>
        </section>
      </main>

      <footer className="text-center py-6 text-gray-400 text-sm">
        © {new Date().getFullYear()} Streake Dining ✨
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route path="/" element={<GuestExperience />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}
