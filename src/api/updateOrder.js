// import { doc, updateDoc } from "firebase/firestore";
// import { db } from "../firebase";

// export async function updateOrderStatus(orderId, status) {
//   const orderRef = doc(db, "orders", orderId);
//   await updateDoc(orderRef, { status });
// }


// src/helpers/updateOrder.js
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

/**
 * updateOrderStatus(restaurantSlug, orderId, status)
 */
export async function updateOrderStatus(restaurantSlug = "default", orderId, status) {
  if (!restaurantSlug) throw new Error("restaurantSlug required");
  const orderRef = doc(db, "restaurants", restaurantSlug, "orders", orderId);
  await updateDoc(orderRef, { status });
}
