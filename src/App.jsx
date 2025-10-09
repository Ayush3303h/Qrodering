


// import { BrowserRouter, Routes, Route, useSearchParams } from "react-router-dom";
// import MenuList from "./components/MenuList";
// import Cart from "./components/Cart";
// import Checkout from "./components/Checkout";
// import QRTableDetector from "./components/QRTableDetector";
// import AdminDashboard from "./components/AdminDashboard";
// import Navbar from "./components/Navbar";
// import { CartProvider } from "./context/CartContext";

// function GuestExperience() {
//   const [searchParams] = useSearchParams();
//   const tableId = searchParams.get("table") || null;

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 to-[rgba(248,250,252,0.8)]">
//       <Navbar tableId={tableId} />
//       <main className="flex-1 px-[clamp(1rem,5vw,4rem)] py-12 flex flex-col gap-12">
//         <section className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-12 items-center bg-gradient-to-br from-[rgba(79,70,229,0.1)] to-[rgba(79,70,229,0.03)] rounded-[24px] p-[clamp(2rem,5vw,3rem)] shadow-[0_20px_45px_rgba(15,23,42,0.08)]">
//           <div>
//             <span className="inline-flex items-center gap-1 uppercase text-xs tracking-wider bg-[rgba(249,115,22,0.15)] text-orange-500 px-4 py-2 rounded-full mb-2">
//               Smart Dining
//             </span>
//             <h1 className="m-0 text-[clamp(2rem,4vw,3.2rem)] leading-tight font-bold">
//               Order delicious food right from your table.
//             </h1>
//             <p className="mt-4 text-slate-500 max-w-[32ch]">
//               Scan the QR code, explore the curated menu, and place your order without waiting for staff. Your culinary experience begins here.
//             </p>
//           </div>
//           <div
//             className="w-full aspect-[4/3] rounded-[24px] relative border border-[rgba(79,70,229,0.12)] bg-gradient-to-b from-[rgba(79,70,229,0.15)] to-[transparent]"
//             aria-hidden="true"
//           >
//             <div className="absolute inset-[12%] rounded-[24px] border border-dashed border-[rgba(79,70,229,0.3)]"></div>
//           </div>
//         </section>

//         <section className="grid lg:grid-cols-[1.7fr_1fr] gap-10 items-start">
//           <div className="flex flex-col gap-6">
//             <QRTableDetector tableId={tableId} />
//             <MenuList tableId={tableId} />
//           </div>
//           <aside className="flex flex-col gap-6 lg:sticky lg:top-[120px]">
//             <Cart />
//             <Checkout tableId={tableId} />
//           </aside>
//         </section>
//       </main>
//       <footer className="text-center py-6 text-slate-400 text-sm">
//         © {new Date().getFullYear()} Streamline Dining · Powered by QR magic ✨
//       </footer>
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <CartProvider>
//         <Routes>
//           {/* <Route path="/" element={<GuestExperience />} />
//           <Route path="/admin" element={<AdminDashboard />} /> */}
//           <Route path="/" element={<GuestExperience />} />
//           <Route path="/checkout" element={<Checkout />} />
//           <Route path="/admin" element={<AdminDashboard />} />
//         </Routes>
//       </CartProvider>
//     </BrowserRouter>
//   );
// }


// App.jsx
import { BrowserRouter, Routes, Route, useSearchParams } from "react-router-dom";
import MenuList from "./components/MenuList";
import Checkout from "./components/Checkout";
import QRTableDetector from "./components/QRTableDetector";
import AdminDashboard from "./components/AdminDashboard";
import Navbar from "./components/Navbar";
import { CartProvider } from "./context/CartContext";

function GuestExperience() {
  const [searchParams] = useSearchParams();
  const tableId = searchParams.get("table") || null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 to-[rgba(248,250,252,0.8)]">
      <Navbar tableId={tableId} />
      <main className="flex-1 px-[clamp(1rem,5vw,4rem)] py-12 flex flex-col gap-12">
        {/* Hero section */}
        <section className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-12 items-center bg-gradient-to-br from-[rgba(79,70,229,0.1)] to-[rgba(79,70,229,0.03)] rounded-[24px] p-[clamp(2rem,5vw,3rem)] shadow-[0_20px_45px_rgba(15,23,42,0.08)]">
          <div>
            <span className="inline-flex items-center gap-1 uppercase text-xs tracking-wider bg-[rgba(249,115,22,0.15)] text-orange-500 px-4 py-2 rounded-full mb-2">
              Smart Dining
            </span>
            <h1 className="m-0 text-[clamp(2rem,4vw,3.2rem)] leading-tight font-bold">
              Order delicious food right from your table.
            </h1>
            <p className="mt-4 text-slate-500 max-w-[32ch]">
              Scan the QR code, explore the curated menu, and place your order without waiting for staff. Your culinary experience begins here.
            </p>
          </div>
          <div
            className="w-full aspect-[4/3] rounded-[24px] relative border border-[rgba(79,70,229,0.12)] bg-gradient-to-b from-[rgba(79,70,229,0.15)] to-[transparent]"
            aria-hidden="true"
          >
            <div className="absolute inset-[12%] rounded-[24px] border border-dashed border-[rgba(79,70,229,0.3)]"></div>
          </div>
        </section>

        {/* Menu section */}
        <section className="flex flex-col gap-6">
          <QRTableDetector tableId={tableId} />
          <MenuList tableId={tableId} />
        </section>
      </main>

      <footer className="text-center py-6 text-slate-400 text-sm">
        © {new Date().getFullYear()} Streamline Dining · Powered by QR magic ✨
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
