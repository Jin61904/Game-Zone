import { getCart, removeFromCart, updateQuantity } from "@/lib/cart";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

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

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Mi carrito</Text>

      {cart.map((item) => (
        <View key={item.id} style={{ marginVertical: 15 }}>
          <Image
            source={{ uri: item.image }}
            style={{ width: "100%", height: 150, borderRadius: 10 }}
          />
          <Text style={{ fontSize: 18, marginTop: 10 }}>{item.name}</Text>
          <Text>${item.price.toLocaleString()}</Text>

          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <TouchableOpacity onPress={() => changeQty(item.id, item.qty - 1)}>
              <Text style={{ fontSize: 25 }}>-</Text>
            </TouchableOpacity>

            <Text style={{ marginHorizontal: 15, fontSize: 18 }}>
              {item.qty}
            </Text>

            <TouchableOpacity onPress={() => changeQty(item.id, item.qty + 1)}>
              <Text style={{ fontSize: 25 }}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => remove(item.id)}
            style={{ marginTop: 10 }}
          >
            <Text style={{ color: "red" }}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Text style={{ fontSize: 20, marginTop: 20 }}>
        Total: ${total().toLocaleString()}
      </Text>
    </ScrollView>
  );
}
