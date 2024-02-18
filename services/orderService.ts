import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

const fetchOrders = async () => {
  try {
    const q = query(collection(db, "orders"));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const ordersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        storeId: doc.data().storeId,
        // Add more order details as needed
      }));
      return ordersData;
    } else {
      console.error("No orders found in the database");
      return [];
    }
  } catch (error: any) {
    console.error("Error fetching orders:", error.message);
    return [];
  }
};

export default fetchOrders;
