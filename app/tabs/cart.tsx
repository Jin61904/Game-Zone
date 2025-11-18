import { SimpleHeader } from "@/components/headers/SimpleHeader";
import { getCart, removeFromCart, updateQuantity } from "@/lib/cart";
import { colors, radius, spacing } from "@/theme";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function CartScreen() {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const items = await getCart();
    setCart(items);
  }

  function total() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  async function changeQty(id: string, qty: number) {
    const updated = await updateQuantity(id, qty);
    setCart(updated);
  }

  async function remove(id: string) {
    const updated = await removeFromCart(id);
    setCart(updated);
  }

  // 🟣 Vista de carrito vacío
  if (cart.length === 0) {
    return (
        
      <View style={styles.emptyContainer}>
  
        <Text style={styles.emptyTitle}>Mi Carrito Gaming</Text>

        <Text style={styles.emptyIcon}>🛒</Text>

        <Text style={styles.emptySubtitle}>Tu carrito gaming está vacío</Text>

        <TouchableOpacity onPress={() => router.push("/tabs/home")}>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.emptyButton}
          >
            <Text style={styles.emptyButtonText}>🎮 Explorar Gaming</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  // 🟣 Vista del carrito con productos
  return (
    <ScrollView style={styles.container}>
        <SimpleHeader />
      <Text style={styles.title}>Mi Carrito Gaming</Text>

      {/* Items en el carrito */}
      {cart.map((item) => (
        <View key={item.id} style={styles.card}>
          <Image source={{ uri: item.image }} style={styles.productImage} />

          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>${item.price.toLocaleString()}</Text>

            {/* Etiqueta de categoría */}
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{item.categoryLabel}</Text>
            </View>

            {/* Controles de cantidad */}
            <View style={styles.qtyContainer}>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => changeQty(item.id, item.qty - 1)}
              >
                <Text style={styles.qtyButtonText}>−</Text>
              </TouchableOpacity>

              <Text style={styles.qtyValue}>{item.qty}</Text>

              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => changeQty(item.id, item.qty + 1)}
              >
                <Text style={styles.qtyButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.priceRight}>
            <Text style={styles.priceRightText}>
              ${(item.price * item.qty).toLocaleString()}
            </Text>

            <TouchableOpacity onPress={() => remove(item.id)}>
              <Text style={styles.removeIcon}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Resumen */}
      <View style={styles.summaryBox}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Subtotal ({cart.length} productos):
          </Text>
          <Text style={styles.summaryValue}>${total().toLocaleString()}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Envío:</Text>
          <Text style={styles.freeShipping}>GRATIS</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryTotal}>Total:</Text>
          <Text style={styles.summaryTotalValue}>${total().toLocaleString()}</Text>
        </View>

        <TouchableOpacity>
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.payButton}
          >
            <Text style={styles.payButtonText}>Proceder al Pago</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* 🎨 ESTILOS VISUALES EXACTOS AL FIGMA */
const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: spacing.md,
    color: "#000",
  },

  /* ——————— Carrito Vacío ——————— */
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: spacing.md,
  },

  emptyIcon: {
    fontSize: 70,
    marginVertical: spacing.md,
  },

  emptySubtitle: {
    color: "#666",
    marginBottom: spacing.lg,
    fontSize: 16,
  },

  emptyButton: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: radius.xl,
  },

  emptyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  /* ——————— Producto ——————— */
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },

  productImage: {
    width: 90,
    height: 90,
    borderRadius: radius.md,
  },

  productName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },

  productPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primaryDark,
  },

  categoryTag: {
    alignSelf: "flex-start",
    marginTop: spacing.xs,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.lg,
  },

  categoryText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: "600",
  },

  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
  },

  qtyButton: {
    width: 35,
    height: 35,
    borderRadius: radius.lg,
    backgroundColor: "#f1f1f1",
    alignItems: "center",
    justifyContent: "center",
  },

  qtyButtonText: {
    fontSize: 22,
    color: "#333",
  },

  qtyValue: {
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: spacing.md,
  },

  priceRight: {
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  priceRightText: {
    fontSize: 16,
    fontWeight: "600",
  },

  removeIcon: {
    fontSize: 22,
    marginTop: spacing.sm,
  },

  /* ——————— Resumen ——————— */
  summaryBox: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    backgroundColor: "#fff",
    borderRadius: radius.lg,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },

  summaryLabel: {
    color: "#555",
    fontSize: 15,
  },

  summaryValue: {
    fontSize: 15,
    fontWeight: "600",
  },

  freeShipping: {
    color: "green",
    fontWeight: "700",
  },

  summaryTotal: {
    fontSize: 18,
    fontWeight: "700",
  },

  summaryTotalValue: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.primaryDark,
  },

  payButton: {
    marginTop: spacing.lg,
    paddingVertical: 14,
    borderRadius: radius.xl,
  },

  payButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "700",
  },
});
