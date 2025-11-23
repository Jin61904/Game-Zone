import { db } from "@/lib/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";

export async function saveOrder(userId: string, cart: any[], total: number) {
  try {
    const ordersRef = collection(db, "orders");

    const docRef = await addDoc(ordersRef, {
      userId,
      cart,
      total,
      createdAt: Timestamp.now(),
    });

    return docRef.id;

  } catch (error) {
    console.error("Error saving order:", error);
    throw error;
  }
}
