import { useCartCount } from "@/lib/cartStore";
import { colors } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export function CartTabIcon({ color }) {
  const { count } = useCartCount();

  return (
    <View style={{ position: "relative" }}>
      <Ionicons name="cart-outline" size={22} color={color} />

      {count > 0 && (
        <View
          style={{
            position: "absolute",
            top: -4,
            right: -8,
            backgroundColor: colors.primaryDark,
            width: 16,
            height: 16,
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 10 }}>{count}</Text>
        </View>
      )}
    </View>
  );
}
