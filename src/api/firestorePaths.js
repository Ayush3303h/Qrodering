// src/helpers/firestorePaths.js
import { collection, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export function restCollections(slug) {
  if (!slug) throw new Error("restaurantSlug is required");
  return {
    menu: () => collection(db, "restaurants", slug, "menu"),
    orders: () => collection(db, "restaurants", slug, "orders"),
    tables: () => collection(db, "restaurants", slug, "tables"),
    orderDoc: (id) => doc(db, "restaurants", slug, "orders", id),
    menuDoc: (id) => doc(db, "restaurants", slug, "menu", id),
  };
}
