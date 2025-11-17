import { colors, fonts, radius, shadows, spacing } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  product: any;
  onPress: () => void;
  onFavorite: () => void;
  onAddToCart: () => void;
}

export const ProductCard: React.FC<Props> = ({
  product,
  onPress,
  onFavorite,
  onAddToCart,
}) => {
  return (
    <View style={styles.card}>
      {/* Descuento */}
      {product.discount && (
        <View style={styles.discount}>
          <Text style={styles.discountText}>-{product.discount}%</Text>
        </View>
      )}

      {/* Favorito */}
      <TouchableOpacity style={styles.favorite} onPress={onFavorite}>
        <Ionicons name="heart-outline" size={20} color={colors.primary} />
      </TouchableOpacity>

      {/* Imagen */}
      <Image source={{ uri: product.image }} style={styles.image} />

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.desc}>{product.description}</Text>

        {/* Rating */}
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color="#FBBF24" />
          <Text style={styles.rating}>
            {product.rating} ({product.reviews})
          </Text>
        </View>

        {/* Price Row */}
        <View style={styles.row}>
          <View>
            <Text style={styles.price}>${product.price}</Text>
            {product.oldPrice && (
              <Text style={styles.oldPrice}>${product.oldPrice}</Text>
            )}
          </View>

          <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>Ver</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    ...shadows.card,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },

  info: {
    padding: spacing.md,
  },

  title: {
    fontSize: fonts.subtitle,
    fontWeight: fonts.bold,
    color: colors.textPrimary,
  },

  desc: {
    fontSize: fonts.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
    gap: spacing.xs,
  },

  rating: {
    fontSize: fonts.bodySmall,
    color: colors.textSecondary,
  },

  row: {
    marginTop: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  price: {
    fontSize: fonts.subtitle,
    fontWeight: fonts.bold,
    color: colors.primaryDark,
  },

  oldPrice: {
    textDecorationLine: "line-through",
    color: colors.textSecondary,
    marginTop: -2,
  },

  button: {
    backgroundColor: colors.primaryLight,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },

  buttonText: {
    color: "white",
    fontWeight: fonts.semibold,
  },

  discount: {
    position: "absolute",
    zIndex: 10,
    top: spacing.md,
    left: spacing.md,
    backgroundColor: colors.danger,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: radius.sm,
  },

  discountText: {
    color: "white",
    fontSize: fonts.bodySmall,
    fontWeight: fonts.semibold,
  },

  favorite: {
    position: "absolute",
    zIndex: 10,
    top: spacing.md,
    right: spacing.md,
    backgroundColor: "white",
    padding: spacing.sm,
    borderRadius: radius.full,
    ...shadows.light,
  },
});
