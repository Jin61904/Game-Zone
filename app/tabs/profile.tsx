import { SimpleHeader } from "@/components/headers/SimpleHeader";
import { useAuthModal } from "@/lib/authModalStore";
import { useCartCount } from "@/lib/cartStore";
import { getFavoritesCount } from "@/lib/favorites";
import { useUser } from "@/lib/userStore";
import { colors, fonts, radius, spacing } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const { user, logout } = useUser();
  const { open } = useAuthModal();

  // EXTRAER SOLO EL NÚMERO DEL STORE
  const { count: cartCount } = useCartCount();

  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    async function loadFavs() {
      const c = await getFavoritesCount();
      setFavCount(c);
    }
    loadFavs();
  }, []);

  return (
    <View style={styles.container}>
      <SimpleHeader onCartPress={() => router.push("/tabs/cart")} />

      {!user ? (
        <NotLoggedView open={open} />
      ) : (
        <LoggedView
          user={user}
          cartCount={cartCount}
          favCount={favCount}
          onLogout={logout}
        />
      )}
    </View>
  );
}

/* -------------------------
    NO LOGGED VIEW
--------------------------- */
function NotLoggedView({ open }) {
  return (
    <ScrollView contentContainerStyle={styles.notLoggedContainer}>
      <View style={styles.card}>
        <View style={styles.avatarCircle}>
          <Ionicons name="person" size={40} color={colors.primaryDark} />
        </View>

        <Text style={styles.title}>Mi Perfil Gamer</Text>
        <Text style={styles.subtitle}>
          Únete a la comunidad gaming y disfruta de ofertas exclusivas
        </Text>

        {/* BOTÓN LOGIN */}
        <TouchableOpacity style={styles.primaryButton} onPress={() => open("login")}>
          <Ionicons name="log-in-outline" size={18} color="white" />
          <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        {/* CREAR CUENTA */}
        <TouchableOpacity style={styles.secondaryButton} onPress={() => open("register")}>
          <Text style={styles.secondaryButtonText}>Crear Cuenta Gamer</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <Text style={styles.benefitsTitle}>Beneficios de ser miembro:</Text>

        <View style={styles.benefitRow}>
          <Ionicons name="game-controller" size={20} color={colors.primary} />
          <Text style={styles.benefitText}>Acceso anticipado a lanzamientos</Text>
        </View>

        <View style={styles.benefitRow}>
          <Ionicons name="diamond" size={20} color="#60A5FA" />
          <Text style={styles.benefitText}>Descuentos exclusivos VIP</Text>
        </View>

        <View style={styles.benefitRow}>
          <Ionicons name="cube" size={20} color="#34D399" />
          <Text style={styles.benefitText}>Envío gratis en pedidos +$50</Text>
        </View>

        <View style={styles.benefitRow}>
          <Ionicons name="star" size={20} color="#F59E0B" />
          <Text style={styles.benefitText}>Programa de puntos y recompensas</Text>
        </View>
      </View>
    </ScrollView>
  );
}

/* -------------------------
    LOGGED VIEW
--------------------------- */
function LoggedView({ user, cartCount, favCount, onLogout }) {
  return (
    <ScrollView contentContainerStyle={styles.loggedContainer}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={40} color={colors.primaryDark} />
          </View>

          <View>
            <Text style={styles.name}>{user.username}</Text>
            <Text style={styles.email}>{user.email}</Text>
            <Text style={styles.memberDate}>Miembro activo</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{favCount}</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{cartCount}</Text>
            <Text style={styles.statLabel}>En Carrito</Text>
          </View>
        </View>

        {/* Options */}
        <ProfileButton icon="settings-outline" label="Configuración de Cuenta" onPress={() => { }} />

        <ProfileButton
          icon="heart-outline"
          label={`Mis Favoritos (${favCount})`}
          onPress={() => router.push("/favorites")}
        />

        <ProfileButton icon="cart-outline" label="Historial de Compras" onPress={() => { }} />

        <ProfileButton icon="log-out-outline" label="Cerrar Sesión" danger onPress={onLogout} />
      </View>
    </ScrollView>
  );
}

/* -------------------------
    COMPONENTE REUTILIZABLE
--------------------------- */
function ProfileButton({ icon, label, danger, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.optionBtn, danger && styles.dangerBtn]}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={20}
        color={danger ? colors.danger : colors.primaryDark}
      />
      <Text style={[styles.optionText, danger && styles.optionTextDanger]}>{label}</Text>
    </TouchableOpacity>
  );
}

/* -------------------------
        STYLES
--------------------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  card: {
    backgroundColor: "white",
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.lg,
    marginTop: spacing.lg,
  },
  notLoggedContainer: { paddingBottom: 120 },
  loggedContainer: { paddingBottom: 120 },

  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: spacing.md,
  },

  title: {
    fontSize: fonts.title2,
    fontWeight: fonts.bold,
    textAlign: "center",
    color: colors.textPrimary,
  },

  subtitle: {
    fontSize: fonts.body,
    textAlign: "center",
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },

  primaryButton: {
    flexDirection: "row",
    backgroundColor: colors.primaryDark,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },

  primaryButtonText: {
    color: "white",
    fontSize: fonts.body,
    fontWeight: fonts.semibold,
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
    marginBottom: spacing.lg,
  },

  secondaryButtonText: {
    color: colors.primaryDark,
    fontSize: fonts.body,
    fontWeight: fonts.semibold,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },

  benefitsTitle: {
    fontSize: fonts.subtitle,
    fontWeight: fonts.semibold,
    marginBottom: spacing.md,
    alignSelf: "center",
  },

  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.sm,
  },

  benefitText: { fontSize: fonts.body, color: colors.textPrimary },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },

  name: { fontSize: fonts.subtitle, fontWeight: fonts.bold },
  email: { color: colors.textSecondary, marginTop: spacing.xs },
  memberDate: { color: colors.textSecondary, fontSize: fonts.bodySmall },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },

  statBox: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
    marginHorizontal: spacing.xs,
  },

  statNumber: {
    fontSize: fonts.title2,
    fontWeight: fonts.bold,
    color: "white",
  },

  statLabel: { color: "white" },

  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
  },

  dangerBtn: { borderColor: colors.danger },

  optionText: {
    color: colors.primaryDark,
    fontSize: fonts.body,
  },

  optionTextDanger: {
    color: colors.danger,
  },
});
