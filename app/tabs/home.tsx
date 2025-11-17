import { CategoryTabs } from "@/components/CategoryTabs";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { HomeHeader } from "@/components/headers/HomeHeader";
import { ProductCard } from "@/components/ProductCard";
import { colors, spacing } from "@/theme";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

// TEMPORAL: Datos mock hasta conectar Firebase
import { mockFeatured, mockProducts } from "@/mock/products";

export default function HomeScreen() {
  const [category, setCategory] = useState("all");
  const [cartCount, setCartCount] = useState(1); // luego viene de firestore
  const [products, setProducts] = useState(mockProducts);

  // Filtrar productos por categoría
  useEffect(() => {
    if (category === "all") {
      setProducts(mockProducts);
    } else {
      setProducts(mockProducts.filter((p) => p.category === category));
    }
  }, [category]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <HomeHeader 
        cartCount={cartCount}
        onCartPress={() => router.push("/(tabs)/cart")}
      />

      <FlatList
        ListHeaderComponent={
          <>
            <FeaturedCarousel products={mockFeatured} />

            <CategoryTabs
              selected={category}
              onSelect={setCategory}
              categories={[
                { id: "all", label: "Todos" },
                { id: "consolas", label: "Consolas" },
                { id: "ps5", label: "Juegos PS5" },
                { id: "xbox", label: "Juegos Xbox" },
              ]}
            />

            <View style={{ height: spacing.md }} />
          </>
        }
        data={products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => router.push(`/product/${item.id}`)}
            onFavorite={() => console.log("Favorito:", item.id)}
            onAddToCart={() => console.log("Carrito:", item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
