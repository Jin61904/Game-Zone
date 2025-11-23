import { SimpleHeader } from "@/components/headers/SimpleHeader";
import { db } from "@/lib/firebase";
import { useUser } from "@/lib/userStore";
import { colors, radius, spacing } from "@/theme";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function OrdersScreen() {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) loadOrders();
  }, [user]);

  async function loadOrders() {
    const q = query(
      collection(db, "orders"),
      where("userId", "==", user.id),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    setOrders(list);
  }

  // 🟣 No logueado
  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.warning}>Inicia sesión para ver tu historial</Text>
      </View>
    );
  }

  // 🟣 Sin compras todavía
  if (orders.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>Aún no has realizado compras.</Text>

        {/* 🟣 Botón Seguir comprando */}
        <TouchableOpacity
          onPress={() => router.push("/tabs/home")}
          style={{ width: "70%", marginTop: spacing.lg }}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.buyButton}
          >
            <Text style={styles.buyButtonText}>Seguir Comprando</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  // 🟣 Lista de compras
  return (
    <View style={styles.screen}>
      <SimpleHeader title="Historial de Compras" />

      <ScrollView style={styles.container}>
        {orders.map((order) => (
          <View key={order.id} style={styles.card}>
            <Text style={styles.orderId}>Pedido #{order.id.slice(0, 6)}</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Total:</Text>
              <Text style={styles.value}>
                ${order.total.toLocaleString()}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Productos:</Text>
              <Text style={styles.value}>{order.cart.length}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Fecha:</Text>
              <Text style={styles.date}>
                {order.createdAt.toDate().toLocaleString()}
              </Text>
            </View>

            <View style={styles.statusBox}>
              <Text style={styles.status}>✔ Completado</Text>
            </View>
          </View>
        ))}

        {/* 🟣 Botón al final */}
        <TouchableOpacity
          onPress={() => router.push("/tabs/home")}
          style={{ width: "70%", alignSelf: "center", marginVertical: spacing.xl }}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.buyButton}
          >
            <Text style={styles.buyButtonText}>Seguir Comprando</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },

  empty: {
    fontSize: 16,
    color: "#666",
  },

  warning: {
    fontSize: 16,
    color: "crimson",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },

  orderId: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: spacing.sm,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },

  label: {
    color: "#444",
    fontSize: 14,
  },

  value: {
    fontWeight: "700",
    fontSize: 14,
  },

  date: {
    fontSize: 12,
    color: "#888",
  },

  statusBox: {
    marginTop: spacing.md,
    backgroundColor: "#4ade8033",
    paddingVertical: 6,
    borderRadius: radius.md,
  },

  status: {
    color: "#16a34a",
    fontWeight: "700",
    textAlign: "center",
  },

  /* 🟣 Botón Seguir Comprando */
  buyButton: {
    paddingVertical: 14,
    borderRadius: radius.xl,
  },

  buyButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
  },
});
