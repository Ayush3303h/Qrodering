import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function updateOrderStatus(orderId, status) {
  const orderRef = doc(db, "orders", orderId);
  await updateDoc(orderRef, { status });
}
