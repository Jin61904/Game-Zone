import { colors, fonts, radius, spacing } from "@/theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  selected: string;
  onSelect: (id: string) => void;
  categories: { id: string; label: string }[];
}

export const CategoryTabs: React.FC<Props> = ({
  selected,
  onSelect,
  categories,
}) => {
  return (
    <View style={styles.container}>
      {categories.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          onPress={() => onSelect(cat.id)}
          style={[
            styles.tab,
            selected === cat.id && styles.tabActive,
          ]}
        >
          <Text
            style={[
              styles.label,
              selected === cat.id && styles.labelActive,
            ]}
          >
            {cat.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginTop: spacing.md,
  },

  tab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },

  tabActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },

  label: {
    fontSize: fonts.body,
    color: colors.textSecondary,
  },

  labelActive: {
    color: "white",
    fontWeight: fonts.semibold,
  },
});
