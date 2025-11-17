import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export async function getAllProducts() {
  const snapshot = await getDocs(collection(db, "products"));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getFeaturedProducts() {
  const snapshot = await getDocs(collection(db, "featured"));
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getProductById(id: string) {
  const ref = doc(db, "products", id);
  const snap = await getDoc(ref);

  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}
