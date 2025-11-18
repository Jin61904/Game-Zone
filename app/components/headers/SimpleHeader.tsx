import { useCartCount } from "@/lib/cartStore";
import { colors, fonts, radius, spacing } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  onCartPress?: () => void;
}

export const SimpleHeader: React.FC<Props> = ({ onCartPress }) => {
  const { count } = useCartCount(); // ⭐ dinámico

  return (
    <LinearGradient colors={colors.gradient} style={styles.container}>
      <Text style={styles.logo}>GameZone</Text>

      <TouchableOpacity style={styles.cartBtn} onPress={onCartPress}>
        <Ionicons name="cart-outline" size={22} color="white" />

        {count > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{count}</Text>
          </View>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },

  logo: {
    color: "white",
    fontSize: fonts.title2,
    fontWeight: fonts.bold,
  },

  cartBtn: {
    position: "relative",
  },

  badge: {
    position: "absolute",
    top: -6,
    right: -8,
    backgroundColor: colors.primaryDark,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },

  badgeText: {
    color: "white",
    fontSize: 10,
  },
});
