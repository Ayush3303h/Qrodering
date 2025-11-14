

// src/helpers/fetchMenu.js
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

/**
 * Fetch menu for a specific restaurant slug.
 * Usage: fetchMenu("pizzaplace")
 */
export async function fetchMenu(restaurantSlug = "default") {
  if (!restaurantSlug) throw new Error("restaurantSlug required");
  const menuCol = collection(db, "restaurants", restaurantSlug, "menu");
  const menuSnapshot = await getDocs(menuCol);
  const menuList = menuSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return menuList;
}
