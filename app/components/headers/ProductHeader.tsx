import { useCartCount } from "@/lib/cartStore";
import { colors, fonts, radius, spacing } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  onBack?: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
  onCartPress?: () => void;
}

export const ProductHeader: React.FC<Props> = ({
  onBack,
  onFavoritePress,
  isFavorite = false,
  onCartPress,
}) => {
  const { count } = useCartCount(); // ⭐ dinámico

  return (
    <LinearGradient colors={colors.gradient} style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.back}>
        <Ionicons name="chevron-back" size={22} color="white" />
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>

      <View style={styles.right}>
        {/* Favorito */}
        <TouchableOpacity onPress={onFavoritePress}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={22}
            color="white"
          />
        </TouchableOpacity>

        {/* Carrito */}
        <TouchableOpacity onPress={onCartPress} style={styles.cartBtn}>
          <Ionicons name="cart-outline" size={22} color="white" />

          {count > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{count}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  back: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  backText: {
    color: "white",
    fontSize: fonts.body,
  },

  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
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
