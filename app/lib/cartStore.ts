import { getCart } from "@/lib/cart";
import { useEffect, useState } from "react";
import { AppState } from "react-native";

export function useCartCount() {
  const [count, setCount] = useState(0);

  async function load() {
    const cart = await getCart();
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    setCount(total);
  }

  useEffect(() => {
    load();

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") load();
    });

    return () => sub.remove();
  }, []);

  return { count, reload: load };
}
