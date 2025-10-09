import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
export async function fetchMenu() {
  console.log("herex")

  const menuCol = collection(db, "menu");
  console.log(menuCol,"herex")
  const menuSnapshot = await getDocs(menuCol);
  const menuList = menuSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return menuList;
}
