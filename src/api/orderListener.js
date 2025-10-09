import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../src/firebase";

export function listenOrders(callback) {
  const orderCol = collection(db, "orders");
  onSnapshot(orderCol, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(orders);
  });
}
