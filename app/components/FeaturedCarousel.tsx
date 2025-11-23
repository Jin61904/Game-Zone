import { colors, fonts, radius, spacing } from "@/theme";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");

interface Props {
  products: any[];
}

export const FeaturedCarousel: React.FC<Props> = ({ products }) => {
  const flatListRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);

  const onScroll = (event: any) => {
    const slide = Math.round(
      event.nativeEvent.contentOffset.x / width
    );
    setIndex(slide);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Productos Destacados</Text>

      <FlatList
        ref={flatListRef}
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        keyExtractor={(item) => item.id}
        onScroll={onScroll}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={styles.content}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <View style={styles.row}>
                <Text style={styles.price}>${item.price}</Text>

                <TouchableOpacity style={styles.button} >
                  <Text onPress={() => router.push(`/product/${item.id}`)} style={styles.buttonText}>Ver Detalles</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {/* Indicadores */}
      <View style={styles.indicators}>
        {products.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { opacity: index === i ? 1 : 0.3 }
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: spacing.md,
  },

  title: {
    fontSize: fonts.subtitle,
    fontWeight: fonts.bold,
    color: colors.textPrimary,
    marginLeft: spacing.lg,
    marginBottom: spacing.md,
  },

  card: {
    width: width * 0.9,
    marginHorizontal: spacing.sm,
    backgroundColor: colors.primaryDeepest,
    borderRadius: radius.lg,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },

  content: {
    padding: spacing.md,
  },

  name: {
    fontSize: fonts.subtitle,
    color: "white",
    fontWeight: fonts.bold,
  },

  description: {
    marginTop: 4,
    color: "rgba(255,255,255,0.8)",
    fontSize: fonts.body,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
    alignItems: "center",
  },

  price: {
    color: colors.textLight,
    fontWeight: fonts.bold,
    fontSize: fonts.subtitle,
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

  indicators: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.sm,
    gap: 6,
  },

  dot: {
    width: 8,
    height: 8,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
});
