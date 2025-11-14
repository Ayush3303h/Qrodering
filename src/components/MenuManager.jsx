// import { useEffect, useState } from "react";
// import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
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

//   // Fetch menu items from restaurants/{slug}/menu subcollection
//   const fetchMenu = async () => {
//     try {
//       const snapshot = await getDocs(collection(db, "restaurants", restaurantSlug, "menu"));
//       setMenu(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
//     } catch (err) {
//       console.error("Failed to fetch menu:", err);
//     }
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

//   // Add single item (improved with error handling & metadata)
//   const handleAdd = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = {
//         ...form,
//         price: Number(form.price) || 0,
//         restaurantSlug, // helpful duplication for rules that look at request.resource.data
//         createdAt: serverTimestamp(),
//       };

//       console.log("Adding menu item payload:", payload);
//       await addDoc(collection(db, "restaurants", restaurantSlug, "menu"), payload);

//       alert("✅ Menu item added!");
//       setForm({
//         name: "",
//         description: "",
//         price: "",
//         category: "",
//         imageURL: "",
//         spicy: false,
//         veg: true,
//       });
//       fetchMenu();
//     } catch (err) {
//       console.error("Failed to add menu item:", err);
//       alert("Failed to add menu item: " + (err.message || err.code || "permission denied"));
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to remove this item?")) return;
//     try {
//       await deleteDoc(doc(db, "restaurants", restaurantSlug, "menu", id));
//       setMenu((prev) => prev.filter((item) => item.id !== id));
//     } catch (err) {
//       console.error("Failed to delete item:", err);
//       alert("Failed to delete item.");
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

//   // CSV upload (keeps using restaurants/{slug}/menu)
//   const handleCSVUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setUploading(true);
//     Papa.parse(file, {
//       header: true,
//       complete: async (results) => {
//         const data = results.data;
//         let addedCount = 0;
//         try {
//           for (const item of data) {
//             if (item.name && item.price) {
//               await addDoc(collection(db, "restaurants", restaurantSlug, "menu"), {
//                 name: item.name.trim(),
//                 price: Number(item.price),
//                 category: item.category?.trim() || "",
//                 description: item.description?.trim() || "",
//                 imageURL: item.imageURL?.trim() || "",
//                 veg: item.veg?.toLowerCase() === "true" || item.veg === "1",
//                 spicy: item.spicy?.toLowerCase() === "true" || item.spicy === "1",
//                 restaurantSlug,
//                 createdAt: serverTimestamp(),
//               });
//               addedCount++;
//             }
//           }
//           alert(`✅ ${addedCount} items uploaded successfully!`);
//           fetchMenu();
//         } catch (err) {
//           console.error("CSV upload failed:", err);
//           alert("❌ CSV upload failed: " + (err.message || err.code || err));
//         } finally {
//           setUploading(false);
//         }
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
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import Papa from "papaparse";
import { db } from "../firebase/firebaseConfig";
import { useParams } from "react-router-dom";

// OCR libs
import Tesseract from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

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

  // ---- fetch menu items ----
  const fetchMenu = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "restaurants", restaurantSlug, "menu")
      );
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

  // ---- Add single item ----
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price: Number(form.price) || 0,
        restaurantSlug,
        createdAt: serverTimestamp(),
      };

      console.log("Adding menu item payload:", payload);
      await addDoc(
        collection(db, "restaurants", restaurantSlug, "menu"),
        payload
      );

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
      alert(
        "Failed to add menu item: " + (err.message || err.code || "permission denied")
      );
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
    if (!window.confirm(`Delete ALL ${menu.length} items? This cannot be undone.`))
      return;
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

  // ---- CSV upload ----
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
              await addDoc(
                collection(db, "restaurants", restaurantSlug, "menu"),
                {
                  name: item.name.trim(),
                  price: Number(item.price),
                  category: item.category?.trim() || "",
                  description: item.description?.trim() || "",
                  imageURL: item.imageURL?.trim() || "",
                  veg:
                    item.veg?.toString().toLowerCase() === "true" ||
                    item.veg === "1",
                  spicy:
                    item.spicy?.toString().toLowerCase() === "true" ||
                    item.spicy === "1",
                  restaurantSlug,
                  createdAt: serverTimestamp(),
                }
              );
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
    const csv = Papa.unparse(
      menu.map((it) => ({
        name: it.name,
        price: it.price,
        category: it.category,
        description: it.description,
        imageURL: it.imageURL,
        veg: it.veg ? "true" : "false",
        spicy: it.spicy ? "true" : "false",
      }))
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "menu_export.csv";
    link.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  };

  // =========================
  // AI Upload: Image / PDF
  // =========================

  useEffect(() => {
    // Try to set pdfjs worker (CDN). Adjust if your bundler needs different path.
    try {
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.8.162/pdf.worker.min.js";
    } catch (e) {
      console.warn("pdfjs worker setup issue:", e);
    }
  }, []);

  const [parsing, setParsing] = useState(false);

  // naive fallback parser
  const fallbackParseLinesToItems = (text) => {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const items = [];
    for (const line of lines) {
      // look for a trailing price pattern
      const priceMatch = line.match(/(?:₹|INR|\$)?\s*([0-9]+(?:[.,][0-9]{1,2})?)\s*$/);
      if (priceMatch) {
        const price = Number(priceMatch[1].replace(",", "."));
        const nameCat = line.slice(0, priceMatch.index).trim();
        let category = "";
        let name = nameCat;
        if (nameCat.includes("-")) {
          const parts = nameCat.split("-");
          category = parts[0].trim();
          name = parts.slice(1).join("-").trim();
        }
        items.push({ name, price, category, description: "" });
      }
    }
    return items;
  };

  const processFileForOCR = async (file) => {
    if (!file) return { text: "" };
    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    let aggregatedText = "";

    if (isPdf) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const maxPages = Math.min(pdf.numPages, 5);
      for (let p = 1; p <= maxPages; p++) {
        const page = await pdf.getPage(p);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);
        const ctx = canvas.getContext("2d");
        await page.render({ canvasContext: ctx, viewport }).promise;
        const { data: { text } = {} } = await Tesseract.recognize(
          canvas,
          "eng",
          { logger: (m) => {} }
        );
        aggregatedText += "\n" + (text || "");
      }
    } else {
      const imgURL = URL.createObjectURL(file);
      const { data: { text } = {} } = await Tesseract.recognize(imgURL, "eng", {
        logger: (m) => {},
      });
      URL.revokeObjectURL(imgURL);
      aggregatedText = text || "";
    }

    return { text: aggregatedText };
  };

  // main handler for AI upload
  const handleAIUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setParsing(true);
    try {
      // 1) OCR locally
      const { text: ocrText } = await processFileForOCR(file);

      // 2) quick local parse fallback
      let items = fallbackParseLinesToItems(ocrText);

      // 3) POST to backend for robust parsing/enrichment (descriptions + image URLs)
      // Backend endpoint should accept 'ocrText' and file and return { items: [...] }
      try {
        const fd = new FormData();
        fd.append("restaurantSlug", restaurantSlug);
        fd.append("ocrText", ocrText);
        fd.append("file", file);

        const resp = await fetch("/api/enrich-menu", {
          method: "POST",
          body: fd,
        });

        if (resp.ok) {
          const parsed = await resp.json();
          if (Array.isArray(parsed.items) && parsed.items.length > 0) {
            items = parsed.items;
          }
        } else {
          console.warn("Backend enrich failed:", resp.statusText);
        }
      } catch (backendErr) {
        console.warn("Backend enrich request failed, using local parse fallback:", backendErr);
      }

      if (!items || items.length === 0) {
        alert("No items found in the uploaded menu. Try a clearer image or a different file.");
        setParsing(false);
        e.target.value = "";
        return;
      }

      // 4) confirm and save
      const confirmed = window.confirm(`Add ${items.length} items parsed from menu?`);
      if (!confirmed) {
        setParsing(false);
        e.target.value = "";
        return;
      }

      let added = 0;
      for (const it of items) {
        try {
          await addDoc(collection(db, "restaurants", restaurantSlug, "menu"), {
            name: it.name || "Unknown",
            price: Number(it.price) || 0,
            category: it.category || "",
            description: it.description || "",
            imageURL: it.imageURL || "",
            veg: it.veg ?? true,
            spicy: it.spicy ?? false,
            restaurantSlug,
            createdAt: serverTimestamp(),
          });
          added++;
        } catch (err) {
          console.error("Failed to add item:", it, err);
        }
      }

      alert(`✅ ${added} items added to the menu.`);
      fetchMenu();
    } catch (err) {
      console.error("AI upload error:", err);
      alert("Failed to parse menu: " + (err.message || err));
    } finally {
      setParsing(false);
      // clear input so same file can be reselected
      e.target.value = "";
    }
  };

  // =========================
  // Render
  // =========================
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
            required
            className="border p-2 rounded-md"
          />
          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
            className="border p-2 rounded-md"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            className="border p-2 rounded-md"
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
            <input type="checkbox" name="veg" checked={form.veg} onChange={handleChange} /> Veg
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="spicy" checked={form.spicy} onChange={handleChange} /> Spicy
          </label>
          <button type="submit" className="bg-indigo-600 text-white py-2 rounded-md col-span-2">
            Add Item
          </button>
        </form>
      </div>

      {/* CSV Upload */}
      <div className="bg-gray-50 p-6 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">Bulk Upload via CSV</h2>
        <input type="file" accept=".csv" onChange={handleCSVUpload} disabled={uploading} />
        <p className="text-sm text-gray-500 mt-2">
          CSV columns: name, price, category, description, imageURL, veg, spicy
        </p>
        {uploading && <p>Uploading...</p>}
      </div>

      {/* AI Upload (Image / PDF) */}
      <div className="bg-gray-50 p-6 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">Add via Menu Image / PDF (AI)</h2>
        <input type="file" accept="image/*,.pdf" onChange={handleAIUpload} disabled={parsing} />
        <p className="text-sm text-gray-500 mt-2">
          Upload a clear photo or PDF of your printed menu. The app will OCR the text,
          parse items (name/category/price), auto-generate missing descriptions and fetch images when needed.
        </p>
        {parsing && <p className="mt-2">Processing... this can take a few seconds.</p>}
      </div>

      {/* Current Menu */}
      <div className="bg-gray-50 p-6 rounded-2xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Current Menu ({menu.length})</h3>
          <div className="flex gap-3">
            <button
              onClick={handleExportCSV}
              disabled={exporting}
              className="bg-green-600 text-white px-4 py-2 rounded-md"
            >
              {exporting ? "Exporting..." : "Export CSV"}
            </button>
            <button
              onClick={handleDeleteAll}
              disabled={deletingAll}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              {deletingAll ? "Deleting..." : "Delete All"}
            </button>
          </div>
        </div>
        <ul className="divide-y divide-gray-200">
          {menu.length > 0 ? (
            menu.map((item) => (
              <li key={item.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {item.name} - ₹{item.price}
                  </p>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>
                <button onClick={() => handleDelete(item.id)} className="text-red-500">
                  Remove
                </button>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-center py-3">No menu items available.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
