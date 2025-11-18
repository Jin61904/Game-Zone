import { CategoryTabs } from "@/components/CategoryTabs";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { HomeHeader } from "@/components/headers/HomeHeader";
import { ProductCard } from "@/components/ProductCard";
import { addToCart } from "@/lib/cart";
import { getAllProducts, getFeaturedProducts } from "@/lib/products";
import { colors, spacing } from "@/theme";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const [category, setCategory] = useState("all");
  const [products, setProducts] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any[]>([]);

  // cargar productos
  useEffect(() => {
    async function load() {
      const p = await getAllProducts();
      setProducts(p);

      const f = await getFeaturedProducts();
      setFeatured(f);
    }
    load();
  }, []);

  return (
    <View style={styles.container}>
      <HomeHeader onCartPress={() => router.push("/tabs/cart")} />

      <FlatList
        ListHeaderComponent={
          <>
            <FeaturedCarousel products={featured} />

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
            onAddToCart={() => addToCart(item)} // ⭐ ahora funcional
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
