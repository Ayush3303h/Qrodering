
// import { useEffect, useState } from "react";
// import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore"; // 🆕 added deleteDoc, doc
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

//   const fetchMenu = async () => {
//     const snapshot = await getDocs(collection(db, "menu"));
//     setMenu(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//   };

//   useEffect(() => {
//     fetchMenu();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

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

//   // 🆕 Delete menu item
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to remove this item?")) {
//       await deleteDoc(doc(db, "menu", id));
//       setMenu((prev) => prev.filter((item) => item.id !== id));
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-xl shadow space-y-6">
//       <h2 className="text-xl font-semibold">Add Menu Item</h2>

//       {/* Add form unchanged */}
//       <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4">
//         <input
//           name="name"
//           placeholder="Name"
//           value={form.name}
//           onChange={handleChange}
//           className="border p-2 rounded-md"
//           required
//         />
//         <input
//           name="category"
//           placeholder="Category"
//           value={form.category}
//           onChange={handleChange}
//           className="border p-2 rounded-md"
//           required
//         />
//         <input
//           type="number"
//           name="price"
//           placeholder="Price"
//           value={form.price}
//           onChange={handleChange}
//           className="border p-2 rounded-md"
//           required
//         />
//         <input
//           name="imageURL"
//           placeholder="Image URL"
//           value={form.imageURL}
//           onChange={handleChange}
//           className="border p-2 rounded-md col-span-2"
//         />
//         <textarea
//           name="description"
//           placeholder="Description"
//           value={form.description}
//           onChange={handleChange}
//           className="border p-2 rounded-md col-span-2"
//         />
//         <label className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             name="veg"
//             checked={form.veg}
//             onChange={handleChange}
//           />{" "}
//           Veg
//         </label>
//         <label className="flex items-center gap-2">
//           <input
//             type="checkbox"
//             name="spicy"
//             checked={form.spicy}
//             onChange={handleChange}
//           />{" "}
//           Spicy
//         </label>

//         <button
//           type="submit"
//           className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md col-span-2"
//         >
//           Add Item
//         </button>
//       </form>

//       <h3 className="text-lg font-semibold mt-6">Current Menu</h3>
//       <ul className="divide-y divide-gray-200">
//         {menu.map((item) => (
//           <li key={item.id} className="py-2 flex justify-between items-center">
//             <span>
//               {item.name} - ₹{item.price}
//             </span>
//             <div className="flex items-center gap-3 text-sm text-gray-500">
//               <span>{item.category}</span>
//               {/* 🆕 Remove button */}
//               <button
//                 onClick={() => handleDelete(item.id)}
//                 className="text-red-500 hover:text-red-700"
//               >
//                 Remove
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export default function MenuManager() {
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

  const fetchMenu = async () => {
    const snapshot = await getDocs(collection(db, "menu"));
    setMenu(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "menu"), {
      ...form,
      price: Number(form.price),
    });
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
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      await deleteDoc(doc(db, "menu", id));
      setMenu((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Menu Item */}
      <div className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Add Menu Item</h2>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            name="imageURL"
            placeholder="Image URL"
            value={form.imageURL}
            onChange={handleChange}
            className="border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400 col-span-2"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-400 col-span-2"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="veg"
              checked={form.veg}
              onChange={handleChange}
            />{" "}
            Veg
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="spicy"
              checked={form.spicy}
              onChange={handleChange}
            />{" "}
            Spicy
          </label>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md col-span-2 shadow transition transform hover:-translate-y-0.5"
          >
            Add Item
          </button>
        </form>
      </div>

      {/* Current Menu */}
      <div className="bg-gray-50 p-6 rounded-2xl shadow-md hover:shadow-lg transition">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Current Menu</h3>
        <ul className="divide-y divide-gray-200">
          {menu.map((item) => (
            <li
              key={item.id}
              className="py-3 flex justify-between items-center hover:bg-gray-100 rounded-md transition px-3"
            >
              <div>
                <p className="font-medium">{item.name} - ₹{item.price}</p>
                <p className="text-sm text-gray-500">{item.category}</p>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-500 hover:text-red-700 font-medium"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
