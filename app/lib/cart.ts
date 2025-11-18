import AsyncStorage from "@react-native-async-storage/async-storage";

const CART_KEY = "gamezone_cart";

export async function getCart() {
  const stored = await AsyncStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
}

export async function addToCart(product) {
  const cart = await getCart();

  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
  return cart;
}

export async function removeFromCart(id: string) {
  const cart = await getCart();
  const updated = cart.filter((item) => item.id !== id);
  await AsyncStorage.setItem(CART_KEY, JSON.stringify(updated));
  return updated;
}

export async function updateQuantity(id: string, qty: number) {
  const cart = await getCart();
  const item = cart.find((i) => i.id === id);
  if (!item) return cart;

  item.qty = qty;
  if (item.qty <= 0) {
    return removeFromCart(id);
  }

  await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
  return cart;
}

export async function clearCart() {
  await AsyncStorage.removeItem(CART_KEY);
}
