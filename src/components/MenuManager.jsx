




// import { useEffect, useState } from "react";
// import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
// import Papa from "papaparse";
// import { db } from "../firebase/firebaseConfig";

// export default function MenuManager() {
//   const [menu, setMenu] = useState([]);
//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     price: "",
//     category: "",
//     imageURL: "",
//     spicy: false,
//     veg: true,
//   });
//   const [uploading, setUploading] = useState(false);

//   // Fetch all menu items
//   const fetchMenu = async () => {
//     const snapshot = await getDocs(collection(db, "menu"));
//     setMenu(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//   };

//   useEffect(() => {
//     fetchMenu();
//   }, []);

//   // Form field change
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   // Add single item
//   const handleAdd = async (e) => {
//     e.preventDefault();
//     await addDoc(collection(db, "menu"), {
//       ...form,
//       price: Number(form.price),
//     });
//     alert("✅ Menu item added!");
//     setForm({
//       name: "",
//       description: "",
//       price: "",
//       category: "",
//       imageURL: "",
//       spicy: false,
//       veg: true,
//     });
//     fetchMenu();
//   };

//   // Delete item
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to remove this item?")) {
//       await deleteDoc(doc(db, "menu", id));
//       setMenu((prev) => prev.filter((item) => item.id !== id));
//     }
//   };

//   // 📦 CSV Bulk Upload Handler
//   const handleCSVUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setUploading(true);

//     Papa.parse(file, {
//       header: true,
//       complete: async (results) => {
//         const data = results.data;
//         let addedCount = 0;

//         for (const item of data) {
//           if (item.name && item.price) {
//             await addDoc(collection(db, "menu"), {
//               name: item.name.trim(),
//               price: Number(item.price),
//               category: item.category?.trim() || "",
//               description: item.description?.trim() || "",
//               imageURL: item.imageURL?.trim() || "",
//               veg: item.veg?.toLowerCase() === "true" || item.veg === "1",
//               spicy: item.spicy?.toLowerCase() === "true" || item.spicy === "1",
//             });
//             addedCount++;
//           }
//         }

//         setUploading(false);
//         alert(`✅ ${addedCount} items uploaded successfully!`);
//         fetchMenu();
//       },
//       error: (error) => {
//         console.error("CSV parse error:", error);
//         setUploading(false);
//         alert("❌ Failed to read the CSV file. Check formatting.");
//       },
//     });
//   };

//   return (
//     <div className="space-y-6">
//       {/* Add Menu Item */}
//       <div className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
//         <h2 className="text-xl font-semibold mb-4 text-gray-700">
//           Add Menu Item
//         </h2>
//         <form
//           onSubmit={handleAdd}
//           className="grid grid-cols-1 md:grid-cols-2 gap-4"
//         >
//           <input
//             name="name"
//             placeholder="Name"
//             value={form.name}
//             onChange={handleChange}
//             className="border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400"
//             required
//           />
//           <input
//             name="category"
//             placeholder="Category"
//             value={form.category}
//             onChange={handleChange}
//             className="border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400"
//             required
//           />
//           <input
//             type="number"
//             name="price"
//             placeholder="Price"
//             value={form.price}
//             onChange={handleChange}
//             className="border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400"
//             required
//           />
//           <input
//             name="imageURL"
//             placeholder="Image URL"
//             value={form.imageURL}
//             onChange={handleChange}
//             className="border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400 col-span-2"
//           />
//           <textarea
//             name="description"
//             placeholder="Description"
//             value={form.description}
//             onChange={handleChange}
//             className="border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400 col-span-2"
//           />
//           <label className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               name="veg"
//               checked={form.veg}
//               onChange={handleChange}
//             />{" "}
//             Veg
//           </label>
//           <label className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               name="spicy"
//               checked={form.spicy}
//               onChange={handleChange}
//             />{" "}
//             Spicy
//           </label>
//           <button
//             type="submit"
//             className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md col-span-2 shadow transition transform hover:-translate-y-0.5"
//           >
//             Add Item
//           </button>
//         </form>
//       </div>

//       {/* 📂 CSV Upload Section */}
//       <div className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
//         <h2 className="text-lg font-semibold mb-4 text-gray-700">
//           Bulk Upload via CSV
//         </h2>
//         <input
//           type="file"
//           accept=".csv"
//           onChange={handleCSVUpload}
//           className="border p-2 rounded-md bg-white cursor-pointer shadow-sm"
//           disabled={uploading}
//         />
//         <p className="text-sm text-gray-500 mt-2">
//           CSV columns should be:{" "}
//           <code>
//             name, price, category, description, imageURL, veg, spicy
//           </code>
//         </p>
//         {uploading && <p className="text-indigo-600 mt-2">Uploading...</p>}
//       </div>

//       {/* Current Menu */}
//       <div className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
//         <h3 className="text-lg font-semibold mb-4 text-gray-700">
//           Current Menu
//         </h3>
//         <ul className="divide-y divide-gray-200">
//           {menu.map((item) => (
//             <li
//               key={item.id}
//               className="py-3 flex justify-between items-center hover:bg-gray-100 rounded-md transition px-3"
//             >
//               <div>
//                 <p className="font-medium">
//                   {item.name} - ₹{item.price}
//                 </p>
//                 <p className="text-sm text-gray-500">{item.category}</p>
//               </div>
//               <button
//                 onClick={() => handleDelete(item.id)}
//                 className="text-red-500 hover:text-red-700 font-medium"
//               >
//                 Remove
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }




// import { useEffect, useState } from "react";
// import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
// import Papa from "papaparse";
// import { db } from "../firebase/firebaseConfig";

// export default function MenuManager() {
//   const [menu, setMenu] = useState([]);
//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     price: "",
//     category: "",
//     imageURL: "",
//     spicy: false,
//     veg: true,
//   });
//   const [uploading, setUploading] = useState(false);
//   const [deletingAll, setDeletingAll] = useState(false);
//   const [exporting, setExporting] = useState(false);

//   // Fetch all menu items
//   const fetchMenu = async () => {
//     const snapshot = await getDocs(collection(db, "menu"));
//     setMenu(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//   };

//   useEffect(() => {
//     fetchMenu();
//   }, []);

//   // Form field change
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   // Add single item
//   const handleAdd = async (e) => {
//     e.preventDefault();
//     await addDoc(collection(db, "menu"), {
//       ...form,
//       price: Number(form.price),
//     });
//     alert("✅ Menu item added!");
//     setForm({
//       name: "",
//       description: "",
//       price: "",
//       category: "",
//       imageURL: "",
//       spicy: false,
//       veg: true,
//     });
//     fetchMenu();
//   };

//   // Delete single item
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to remove this item?")) {
//       await deleteDoc(doc(db, "menu", id));
//       setMenu((prev) => prev.filter((item) => item.id !== id));
//     }
//   };

//   // 🗑️ Delete all items at once
//   const handleDeleteAll = async () => {
//     if (menu.length === 0) {
//       alert("⚠️ No items to delete!");
//       return;
//     }

//     const confirmDelete = window.confirm(
//       `⚠️ Are you sure you want to delete ALL ${menu.length} menu items?\nThis action cannot be undone.`
//     );

//     if (!confirmDelete) return;

//     setDeletingAll(true);

//     try {
//       for (const item of menu) {
//         await deleteDoc(doc(db, "menu", item.id));
//       }
//       setMenu([]);
//       alert("🗑️ All menu items have been deleted!");
//     } catch (error) {
//       console.error("Error deleting all menu items:", error);
//       alert("❌ Failed to delete all items. Try again.");
//     } finally {
//       setDeletingAll(false);
//     }
//   };

//   // 📦 CSV Bulk Upload Handler
//   const handleCSVUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setUploading(true);

//     Papa.parse(file, {
//       header: true,
//       complete: async (results) => {
//         const data = results.data;
//         let addedCount = 0;

//         for (const item of data) {
//           if (item.name && item.price) {
//             await addDoc(collection(db, "menu"), {
//               name: item.name.trim(),
//               price: Number(item.price),
//               category: item.category?.trim() || "",
//               description: item.description?.trim() || "",
//               imageURL: item.imageURL?.trim() || "",
//               veg: item.veg?.toLowerCase() === "true" || item.veg === "1",
//               spicy: item.spicy?.toLowerCase() === "true" || item.spicy === "1",
//             });
//             addedCount++;
//           }
//         }

//         setUploading(false);
//         alert(`✅ ${addedCount} items uploaded successfully!`);
//         fetchMenu();
//       },
//       error: (error) => {
//         console.error("CSV parse error:", error);
//         setUploading(false);
//         alert("❌ Failed to read the CSV file. Check formatting.");
//       },
//     });
//   };

//   // 📤 Export menu to CSV
//   const handleExportCSV = () => {
//     if (menu.length === 0) {
//       alert("⚠️ No items to export!");
//       return;
//     }

//     setExporting(true);

//     const csvData = menu.map((item) => ({
//       name: item.name,
//       price: item.price,
//       category: item.category,
//       description: item.description,
//       imageURL: item.imageURL,
//       veg: item.veg ? "true" : "false",
//       spicy: item.spicy ? "true" : "false",
//     }));

//     const csv = Papa.unparse(csvData);
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "menu_export.csv";
//     link.click();

//     URL.revokeObjectURL(url);
//     setExporting(false);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Add Menu Item */}
//       <div className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
//         <h2 className="text-xl font-semibold mb-4 text-gray-700">
//           Add Menu Item
//         </h2>
//         <form
//           onSubmit={handleAdd}
//           className="grid grid-cols-1 md:grid-cols-2 gap-4"
//         >
//           <input
//             name="name"
//             placeholder="Name"
//             value={form.name}
//             onChange={handleChange}
//             className="border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400"
//             required
//           />
//           <input
//             name="category"
//             placeholder="Category"
//             value={form.category}
//             onChange={handleChange}
//             className="border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400"
//             required
//           />
//           <input
//             type="number"
//             name="price"
//             placeholder="Price"
//             value={form.price}
//             onChange={handleChange}
//             className="border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400"
//             required
//           />
//           <input
//             name="imageURL"
//             placeholder="Image URL"
//             value={form.imageURL}
//             onChange={handleChange}
//             className="border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400 col-span-2"
//           />
//           <textarea
//             name="description"
//             placeholder="Description"
//             value={form.description}
//             onChange={handleChange}
//             className="border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400 col-span-2"
//           />
//           <label className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               name="veg"
//               checked={form.veg}
//               onChange={handleChange}
//             />{" "}
//             Veg
//           </label>
//           <label className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               name="spicy"
//               checked={form.spicy}
//               onChange={handleChange}
//             />{" "}
//             Spicy
//           </label>
//           <button
//             type="submit"
//             className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md col-span-2 shadow transition transform hover:-translate-y-0.5"
//           >
//             Add Item
//           </button>
//         </form>
//       </div>

//       {/* 📂 CSV Upload Section */}
//       <div className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
//         <h2 className="text-lg font-semibold mb-4 text-gray-700">
//           Bulk Upload via CSV
//         </h2>
//         <input
//           type="file"
//           accept=".csv"
//           onChange={handleCSVUpload}
//           className="border p-2 rounded-md bg-white cursor-pointer shadow-sm"
//           disabled={uploading}
//         />
//         <p className="text-sm text-gray-500 mt-2">
//           CSV columns should be:{" "}
//           <code>
//             name, price, category, description, imageURL, veg, spicy
//           </code>
//         </p>
//         {uploading && <p className="text-indigo-600 mt-2">Uploading...</p>}
//       </div>

//       {/* Current Menu */}
//       <div className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
//         <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
//           <h3 className="text-lg font-semibold text-gray-700">
//             Current Menu ({menu.length})
//           </h3>
//           <div className="flex gap-3">
//             <button
//               onClick={handleExportCSV}
//               disabled={exporting}
//               className={`${
//                 exporting
//                   ? "bg-gray-400"
//                   : "bg-green-600 hover:bg-green-700"
//               } text-white px-4 py-2 rounded-md shadow transition`}
//             >
//               {exporting ? "Exporting..." : "Export CSV"}
//             </button>

//             <button
//               onClick={handleDeleteAll}
//               disabled={deletingAll}
//               className={`${
//                 deletingAll
//                   ? "bg-gray-400"
//                   : "bg-red-500 hover:bg-red-600"
//               } text-white px-4 py-2 rounded-md shadow transition`}
//             >
//               {deletingAll ? "Deleting..." : "Delete All"}
//             </button>
//           </div>
//         </div>

//         <ul className="divide-y divide-gray-200">
//           {menu.length > 0 ? (
//             menu.map((item) => (
//               <li
//                 key={item.id}
//                 className="py-3 flex justify-between items-center hover:bg-gray-100 rounded-md transition px-3"
//               >
//                 <div>
//                   <p className="font-medium">
//                     {item.name} - ₹{item.price}
//                   </p>
//                   <p className="text-sm text-gray-500">{item.category}</p>
//                 </div>
//                 <button
//                   onClick={() => handleDelete(item.id)}
//                   className="text-red-500 hover:text-red-700 font-medium"
//                 >
//                   Remove
//                 </button>
//               </li>
//             ))
//           ) : (
//             <p className="text-gray-500 text-sm text-center py-3">
//               No menu items available.
//             </p>
//           )}
//         </ul>
//       </div>
//     </div>
//   );
// }


// // src/components/MenuManager.jsx
// import { useEffect, useState } from "react";
// import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
// import Papa from "papaparse";
// import { db } from "../firebase/firebaseConfig";
// import { useParams } from "react-router-dom";

// export default function MenuManager({ restaurantSlug: propSlug }) {
//   const { restaurantSlug: paramSlug } = useParams();
//   const restaurantSlug = propSlug || paramSlug || "default";

//   const [menu, setMenu] = useState([]);
//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     price: "",
//     category: "",
//     imageURL: "",
//     spicy: false,
//     veg: true,
//   });
//   const [uploading, setUploading] = useState(false);
//   const [deletingAll, setDeletingAll] = useState(false);
//   const [exporting, setExporting] = useState(false);

//   // Fetch all menu items for this restaurant
//   const fetchMenu = async () => {
//     const snapshot = await getDocs(collection(db, "restaurants", restaurantSlug, "menu"));
//     setMenu(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
//   };

//   useEffect(() => {
//     if (restaurantSlug) fetchMenu();
//   }, [restaurantSlug]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleAdd = async (e) => {
//     e.preventDefault();
//     await addDoc(collection(db, "restaurants", restaurantSlug, "menu"), {
//       ...form,
//       price: Number(form.price),
//     });
//     alert("✅ Menu item added!");
//     setForm({
//       name: "",
//       description: "",
//       price: "",
//       category: "",
//       imageURL: "",
//       spicy: false,
//       veg: true,
//     });
//     fetchMenu();
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to remove this item?")) {
//       await deleteDoc(doc(db, "restaurants", restaurantSlug, "menu", id));
//       setMenu((prev) => prev.filter((item) => item.id !== id));
//     }
//   };

//   const handleDeleteAll = async () => {
//     if (menu.length === 0) {
//       alert("⚠️ No items to delete!");
//       return;
//     }
//     if (!window.confirm(`Delete ALL ${menu.length} items? This cannot be undone.`)) return;
//     setDeletingAll(true);
//     try {
//       for (const item of menu) {
//         await deleteDoc(doc(db, "restaurants", restaurantSlug, "menu", item.id));
//       }
//       setMenu([]);
//       alert("🗑️ All menu items deleted!");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to delete all items.");
//     } finally {
//       setDeletingAll(false);
//     }
//   };

//   const handleCSVUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setUploading(true);
//     Papa.parse(file, {
//       header: true,
//       complete: async (results) => {
//         const data = results.data;
//         let addedCount = 0;
//         for (const item of data) {
//           if (item.name && item.price) {
//             await addDoc(collection(db, "restaurants", restaurantSlug, "menu"), {
//               name: item.name.trim(),
//               price: Number(item.price),
//               category: item.category?.trim() || "",
//               description: item.description?.trim() || "",
//               imageURL: item.imageURL?.trim() || "",
//               veg: item.veg?.toLowerCase() === "true" || item.veg === "1",
//               spicy: item.spicy?.toLowerCase() === "true" || item.spicy === "1",
//             });
//             addedCount++;
//           }
//         }
//         setUploading(false);
//         alert(`✅ ${addedCount} items uploaded successfully!`);
//         fetchMenu();
//       },
//       error: (error) => {
//         console.error("CSV parse error:", error);
//         setUploading(false);
//         alert("❌ Failed to read the CSV file. Check formatting.");
//       },
//     });
//   };

//   const handleExportCSV = () => {
//     if (menu.length === 0) return alert("⚠️ No items to export!");
//     setExporting(true);
//     const csv = Papa.unparse(menu.map((it) => ({
//       name: it.name, price: it.price, category: it.category, description: it.description, imageURL: it.imageURL, veg: it.veg ? "true" : "false", spicy: it.spicy ? "true" : "false"
//     })));
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "menu_export.csv";
//     link.click();
//     URL.revokeObjectURL(url);
//     setExporting(false);
//   };

//   return (
//     <div className="space-y-6">
//       {/* Add Menu Item */}
//       <div className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
//         <h2 className="text-xl font-semibold mb-4 text-gray-700">Add Menu Item</h2>
//         <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required className="border p-2 rounded-md" />
//           <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required className="border p-2 rounded-md" />
//           <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} required className="border p-2 rounded-md" />
//           <input name="imageURL" placeholder="Image URL" value={form.imageURL} onChange={handleChange} className="border p-2 rounded-md col-span-2" />
//           <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 rounded-md col-span-2" />
//           <label className="flex items-center gap-2"><input type="checkbox" name="veg" checked={form.veg} onChange={handleChange} /> Veg</label>
//           <label className="flex items-center gap-2"><input type="checkbox" name="spicy" checked={form.spicy} onChange={handleChange} /> Spicy</label>
//           <button type="submit" className="bg-indigo-600 text-white py-2 rounded-md col-span-2">Add Item</button>
//         </form>
//       </div>

//       {/* CSV Upload */}
//       <div className="bg-gray-50 p-6 rounded-2xl shadow-md">
//         <h2 className="text-lg font-semibold mb-4">Bulk Upload via CSV</h2>
//         <input type="file" accept=".csv" onChange={handleCSVUpload} disabled={uploading} />
//         <p className="text-sm text-gray-500 mt-2">CSV columns: name, price, category, description, imageURL, veg, spicy</p>
//         {uploading && <p>Uploading...</p>}
//       </div>

//       {/* Current Menu */}
//       <div className="bg-gray-50 p-6 rounded-2xl shadow-md">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-semibold">Current Menu ({menu.length})</h3>
//           <div className="flex gap-3">
//             <button onClick={handleExportCSV} disabled={exporting} className="bg-green-600 text-white px-4 py-2 rounded-md">{exporting ? "Exporting..." : "Export CSV"}</button>
//             <button onClick={handleDeleteAll} disabled={deletingAll} className="bg-red-500 text-white px-4 py-2 rounded-md">{deletingAll ? "Deleting..." : "Delete All"}</button>
//           </div>
//         </div>
//         <ul className="divide-y divide-gray-200">
//           {menu.length > 0 ? menu.map((item) => (
//             <li key={item.id} className="py-3 flex justify-between items-center">
//               <div>
//                 <p className="font-medium">{item.name} - ₹{item.price}</p>
//                 <p className="text-sm text-gray-500">{item.category}</p>
//               </div>
//               <button onClick={() => handleDelete(item.id)} className="text-red-500">Remove</button>
//             </li>
//           )) : <p className="text-gray-500 text-center py-3">No menu items available.</p>}
//         </ul>
//       </div>
//     </div>
//   );
// }





// src/components/MenuManager.jsx
import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import Papa from "papaparse";
import { db } from "../firebase/firebaseConfig";
import { useParams } from "react-router-dom";

export default function MenuManager({ restaurantSlug: propSlug }) {
  const { restaurantSlug: paramSlug } = useParams();
  const restaurantSlug = propSlug || paramSlug || "default";

  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageURL: "",
    spicy: false,
    veg: true,
  });
  const [uploading, setUploading] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Fetch menu items from restaurants/{slug}/menu subcollection
  const fetchMenu = async () => {
    try {
      const snapshot = await getDocs(collection(db, "restaurants", restaurantSlug, "menu"));
      setMenu(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Failed to fetch menu:", err);
    }
  };

  useEffect(() => {
    if (restaurantSlug) fetchMenu();
  }, [restaurantSlug]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Add single item (improved with error handling & metadata)
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price: Number(form.price) || 0,
        restaurantSlug, // helpful duplication for rules that look at request.resource.data
        createdAt: serverTimestamp(),
      };

      console.log("Adding menu item payload:", payload);
      await addDoc(collection(db, "restaurants", restaurantSlug, "menu"), payload);

      alert("✅ Menu item added!");
      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
        imageURL: "",
        spicy: false,
        veg: true,
      });
      fetchMenu();
    } catch (err) {
      console.error("Failed to add menu item:", err);
      alert("Failed to add menu item: " + (err.message || err.code || "permission denied"));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this item?")) return;
    try {
      await deleteDoc(doc(db, "restaurants", restaurantSlug, "menu", id));
      setMenu((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete item:", err);
      alert("Failed to delete item.");
    }
  };

  const handleDeleteAll = async () => {
    if (menu.length === 0) {
      alert("⚠️ No items to delete!");
      return;
    }
    if (!window.confirm(`Delete ALL ${menu.length} items? This cannot be undone.`)) return;
    setDeletingAll(true);
    try {
      for (const item of menu) {
        await deleteDoc(doc(db, "restaurants", restaurantSlug, "menu", item.id));
      }
      setMenu([]);
      alert("🗑️ All menu items deleted!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete all items.");
    } finally {
      setDeletingAll(false);
    }
  };

  // CSV upload (keeps using restaurants/{slug}/menu)
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const data = results.data;
        let addedCount = 0;
        try {
          for (const item of data) {
            if (item.name && item.price) {
              await addDoc(collection(db, "restaurants", restaurantSlug, "menu"), {
                name: item.name.trim(),
                price: Number(item.price),
                category: item.category?.trim() || "",
                description: item.description?.trim() || "",
                imageURL: item.imageURL?.trim() || "",
                veg: item.veg?.toLowerCase() === "true" || item.veg === "1",
                spicy: item.spicy?.toLowerCase() === "true" || item.spicy === "1",
                restaurantSlug,
                createdAt: serverTimestamp(),
              });
              addedCount++;
            }
          }
          alert(`✅ ${addedCount} items uploaded successfully!`);
          fetchMenu();
        } catch (err) {
          console.error("CSV upload failed:", err);
          alert("❌ CSV upload failed: " + (err.message || err.code || err));
        } finally {
          setUploading(false);
        }
      },
      error: (error) => {
        console.error("CSV parse error:", error);
        setUploading(false);
        alert("❌ Failed to read the CSV file. Check formatting.");
      },
    });
  };

  const handleExportCSV = () => {
    if (menu.length === 0) return alert("⚠️ No items to export!");
    setExporting(true);
    const csv = Papa.unparse(menu.map((it) => ({
      name: it.name, price: it.price, category: it.category, description: it.description, imageURL: it.imageURL, veg: it.veg ? "true" : "false", spicy: it.spicy ? "true" : "false"
    })));
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "menu_export.csv";
    link.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  };

  return (
    <div className="space-y-6">
      {/* Add Menu Item */}
      <div className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Add Menu Item</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required className="border p-2 rounded-md" />
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required className="border p-2 rounded-md" />
          <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} required className="border p-2 rounded-md" />
          <input name="imageURL" placeholder="Image URL" value={form.imageURL} onChange={handleChange} className="border p-2 rounded-md col-span-2" />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 rounded-md col-span-2" />
          <label className="flex items-center gap-2"><input type="checkbox" name="veg" checked={form.veg} onChange={handleChange} /> Veg</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="spicy" checked={form.spicy} onChange={handleChange} /> Spicy</label>
          <button type="submit" className="bg-indigo-600 text-white py-2 rounded-md col-span-2">Add Item</button>
        </form>
      </div>

      {/* CSV Upload */}
      <div className="bg-gray-50 p-6 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">Bulk Upload via CSV</h2>
        <input type="file" accept=".csv" onChange={handleCSVUpload} disabled={uploading} />
        <p className="text-sm text-gray-500 mt-2">CSV columns: name, price, category, description, imageURL, veg, spicy</p>
        {uploading && <p>Uploading...</p>}
      </div>

      {/* Current Menu */}
      <div className="bg-gray-50 p-6 rounded-2xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Current Menu ({menu.length})</h3>
          <div className="flex gap-3">
            <button onClick={handleExportCSV} disabled={exporting} className="bg-green-600 text-white px-4 py-2 rounded-md">{exporting ? "Exporting..." : "Export CSV"}</button>
            <button onClick={handleDeleteAll} disabled={deletingAll} className="bg-red-500 text-white px-4 py-2 rounded-md">{deletingAll ? "Deleting..." : "Delete All"}</button>
          </div>
        </div>
        <ul className="divide-y divide-gray-200">
          {menu.length > 0 ? menu.map((item) => (
            <li key={item.id} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium">{item.name} - ₹{item.price}</p>
                <p className="text-sm text-gray-500">{item.category}</p>
              </div>
              <button onClick={() => handleDelete(item.id)} className="text-red-500">Remove</button>
            </li>
          )) : <p className="text-gray-500 text-center py-3">No menu items available.</p>}
        </ul>
      </div>
    </div>
  );
}
