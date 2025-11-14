

// src/helpers/orderListener.js
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

/**
 * Listen to orders for a restaurant slug.
 * callback receives array of orders.
 * Returns the unsubscribe function.
 */
export function listenOrders(restaurantSlug = "default", callback) {
  if (!restaurantSlug) throw new Error("restaurantSlug required");
  const orderCol = collection(db, "restaurants", restaurantSlug, "orders");
  return onSnapshot(orderCol, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(orders);
  });
}
