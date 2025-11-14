
// src/helpers/placeOrder.js
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

/**
 * placeOrder(restaurantSlug, tableNumber, items)
 * returns created orderId
 */
export async function placeOrder(restaurantSlug = "default", tableNumber, items) {
  if (!restaurantSlug) throw new Error("restaurantSlug required");
  const orderCol = collection(db, "restaurants", restaurantSlug, "orders");
  const orderData = {
    tableNumber,
    items,
    status: "pending",
    createdAt: serverTimestamp()
  };
  const docRef = await addDoc(orderCol, orderData);
  return docRef.id;
}
