import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "gamezone_favorites";

export async function getFavorites() {
  const stored = await AsyncStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
}

export async function toggleFavorite(product) {
  const items = await getFavorites();

  const exists = items.some((i) => i.id === product.id);

  let updated = exists
    ? items.filter((i) => i.id !== product.id)
    : [...items, product];

  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
}

export async function isFavorite(id: string) {
  const items = await getFavorites();
  return items.some((i) => i.id === id);
}
