import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "gamezone_favorites";

// Obtener lista completa
export async function getFavorites() {
  const stored = await AsyncStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Saber si un producto está en favoritos
export async function isFavorite(id: string) {
  const items = await getFavorites();
  return items.some((i) => i.id === id);
}

// Alternar favorito
export async function toggleFavorite(product) {
  const items = await getFavorites();
  const exists = items.some((i) => i.id === product.id);

  let updated;

  if (exists) {
    updated = items.filter((i) => i.id !== product.id); // quitar
  } else {
    updated = [...items, product]; // agregar
  }

  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));

  return !exists; // ⭐ devuelve TRUE si quedó favorito
}

// ⭐ Obtener cantidad de favoritos
export async function getFavoritesCount() {
  const items = await getFavorites();
  return items.length;
}
