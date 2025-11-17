import { ProductHeader } from "@/components/headers/ProductHeader";
import { colors, fonts, radius, spacing } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// TEMP: datos fake hasta conectar firebase
import { getProductById } from "@/lib/products";


export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    async function load() {
      if (!id) return;

      const p = await getProductById(id);
      setProduct(p);
    }

    load();
  }, [id]);


  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <ProductHeader
        cartCount={1}
        isFavorite={product.isFavorite}
        onBack={() => router.back()}
        onCartPress={() => router.push("/(tabs)/cart")}
        onFavoritePress={() => console.log("agregar favorito")}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Imagen */}
        <View style={styles.imageWrapper}>
          {product.discount && (
            <View style={styles.discount}>
              <Text style={styles.discountText}>-{product.discount}% OFF</Text>
            </View>
          )}

          <Image source={{ uri: product.image }} style={styles.image} />
        </View>

        {/* Categoría + rating */}
        <View style={styles.row}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.categoryLabel}</Text>
          </View>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color="#FBBF24" />
            <Text style={styles.ratingText}>
              {product.rating} ({product.reviews} reseñas)
            </Text>
          </View>
        </View>

        {/* Nombre */}
        <Text style={styles.title}>{product.name}</Text>

        {/* Precios */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>${product.price}</Text>
          <Text style={styles.oldPrice}>${product.oldPrice}</Text>
        </View>

        {/* Descripción */}
        <Text style={styles.description}>{product.descriptionLong}</Text>

        {/* Características */}
        <Text style={styles.featuresTitle}>Características principales:</Text>

        {product.features.map((f: string, i: number) => (
          <View style={styles.featureRow} key={i}>
            <Ionicons name="checkmark" size={18} color={colors.success} />
            <Text style={styles.featureText}>{f}</Text>
          </View>
        ))}

        {/* Espacio final */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Botón inferior fijo */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>
            + Agregar al Carrito – ${product.price}
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  scroll: {
    padding: spacing.lg,
    paddingBottom: 160,
  },

  imageWrapper: {
    position: "relative",
    borderRadius: radius.lg,
    overflow: "hidden",
    marginBottom: spacing.lg,
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

  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.sm,
  },

  categoryBadge: {
    backgroundColor: colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radius.sm,
  },

  categoryText: {
    color: "white",
    fontSize: fonts.bodySmall,
    fontWeight: fonts.semibold,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },

  ratingText: {
    color: colors.textSecondary,
    fontSize: fonts.bodySmall,
  },

  title: {
    fontSize: fonts.title2,
    fontWeight: fonts.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
  },

  price: {
    fontSize: fonts.title2,
    fontWeight: fonts.bold,
    color: colors.primaryDark,
  },

  oldPrice: {
    fontSize: fonts.subtitle,
    color: colors.textSecondary,
    textDecorationLine: "line-through",
  },

  description: {
    fontSize: fonts.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },

  featuresTitle: {
    fontSize: fonts.subtitle,
    color: colors.textPrimary,
    fontWeight: fonts.semibold,
    marginBottom: spacing.md,
  },

  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },

  featureText: {
    fontSize: fonts.body,
    color: colors.textPrimary,
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderColor: colors.border,
  },

  addButton: {
    backgroundColor: colors.primaryDark,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },

  addButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: fonts.subtitle,
    fontWeight: fonts.semibold,
  },
});
