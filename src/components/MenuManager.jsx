// // src/components/MenuManager.jsx
// import { useEffect, useState } from "react";
// import { collection, addDoc, getDocs } from "firebase/firestore";
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
//     rating: 0,
//   });

//   // Load menu
//   useEffect(() => {
//     const fetchMenu = async () => {
//       const snapshot = await getDocs(collection(db, "menu"));
//       setMenu(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//     };
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
//       rating: Number(form.rating),
//     });
//     alert("Menu item added!");
//     setForm({
//       name: "",
//       description: "",
//       price: "",
//       category: "",
//       imageURL: "",
//       spicy: false,
//       veg: true,
//       rating: 0,
//     });
//   };

//   return (
//     <div className="bg-white p-6 rounded-xl shadow space-y-6">
//       <h2 className="text-xl font-semibold">Add Menu Item</h2>
//       <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4">
//         <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border p-2 rounded-md" required />
//         <input name="category" placeholder="Category" value={form.category} onChange={handleChange} className="border p-2 rounded-md" required />
//         <input type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} className="border p-2 rounded-md" required />
//         <input type="number" name="rating" placeholder="Rating" value={form.rating} onChange={handleChange} className="border p-2 rounded-md" />
//         <input name="imageURL" placeholder="Image URL" value={form.imageURL} onChange={handleChange} className="border p-2 rounded-md col-span-2" />
//         <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 rounded-md col-span-2" />
//         <label className="flex items-center gap-2">
//           <input type="checkbox" name="veg" checked={form.veg} onChange={handleChange} /> Veg
//         </label>
//         <label className="flex items-center gap-2">
//           <input type="checkbox" name="spicy" checked={form.spicy} onChange={handleChange} /> Spicy
//         </label>
//         <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md col-span-2">
//           Add Item
//         </button>
//       </form>

//       <h3 className="text-lg font-semibold mt-6">Current Menu</h3>
//       <ul className="divide-y divide-gray-200">
//         {menu.map((item) => (
//           <li key={item?.id} className="py-2 flex justify-between">
//             <span>{item?.name} - ₹{item?.price}</span>
//             <span className="text-sm text-gray-500">{itemcategory}</span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
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

  // ✅ Fetch menu function
  const fetchMenu = async () => {
    const snapshot = await getDocs(collection(db, "menu"));
    setMenu(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  // Load menu initially
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
    fetchMenu(); // ✅ Refresh list
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-6">
      <h2 className="text-xl font-semibold">Add Menu Item</h2>

      <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded-md"
          required
        />
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="border p-2 rounded-md"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="border p-2 rounded-md"
          required
        />
        <input
          name="imageURL"
          placeholder="Image URL"
          value={form.imageURL}
          onChange={handleChange}
          className="border p-2 rounded-md col-span-2"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded-md col-span-2"
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
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md col-span-2"
        >
          Add Item
        </button>
      </form>

      <h3 className="text-lg font-semibold mt-6">Current Menu</h3>
      <ul className="divide-y divide-gray-200">
        {menu.map((item) => (
          <li key={item.id} className="py-2 flex justify-between">
            <span>
              {item.name} - ₹{item.price}
            </span>
            <span className="text-sm text-gray-500">{item.category}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
