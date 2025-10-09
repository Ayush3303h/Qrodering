import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export async function placeOrder(tableNumber, items) {
  const orderCol = collection(db, "orders");
  const orderData = {
    tableNumber,
    items,
    status: "pending",
    createdAt: serverTimestamp()
  };
  const docRef = await addDoc(orderCol, orderData);
  console.log("Order placed with ID:", docRef.id);
}
