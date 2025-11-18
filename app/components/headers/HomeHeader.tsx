import { useCartCount } from "@/lib/cartStore";
import { colors, fonts, radius, spacing } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  onCartPress?: () => void;
  onFilterPress?: () => void;
}

export const HomeHeader: React.FC<Props> = ({
  onCartPress,
  onFilterPress,
}) => {
  const { count } = useCartCount(); // ⭐ contador dinámico

  return (
    <LinearGradient colors={colors.gradient} style={styles.container}>
      {/* Top Row */}
      <View style={styles.topRow}>
        <Text style={styles.logo}>GameZone</Text>

        <View style={styles.actions}>
          <TouchableOpacity onPress={onFilterPress}>
            <Ionicons name="filter-outline" size={22} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.cartBtn} onPress={onCartPress}>
            <Ionicons name="cart-outline" size={22} color="white" />
            {count > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{count}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={18}
          color="white"
          style={{ marginRight: spacing.sm }}
        />
        <TextInput
          placeholder="Buscar consolas y juegos..."
          placeholderTextColor="rgba(255,255,255,0.7)"
          style={styles.searchInput}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },

  logo: {
    color: "white",
    fontSize: fonts.title2,
    fontWeight: fonts.bold,
  },

  actions: {
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
    fontWeight: fonts.bold,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.25)",
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    marginTop: spacing.sm,
  },

  searchInput: {
    flex: 1,
    color: "white",
    fontSize: fonts.body,
  },
});
