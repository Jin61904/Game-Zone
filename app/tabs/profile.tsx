import { ProductCard } from "@/components/ProductCard";
import { SimpleHeader } from "@/components/headers/SimpleHeader";
import { addToCart } from "@/lib/cart";
import { getFavorites, getFavoritesCount, toggleFavorite } from "@/lib/favorites";
import { useAuthModal } from "@/lib/authModalStore";
import { useCartCount } from "@/lib/cartStore";
import { useUser } from "@/lib/userStore";
import { changePassword, updateUsername } from "@/Services/authService";
import { colors, fonts, radius, spacing } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const { user, logout } = useUser();
  const { open } = useAuthModal();

  // Solo número del carrito
  const { count: cartCount } = useCartCount();

  const [favCount, setFavCount] = useState(0);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    async function loadFavs() {
      const c = await getFavoritesCount();
      setFavCount(c);
    }
    loadFavs();
  }, []);

  useEffect(() => {
    if (showFavorites) {
      loadFavorites();
    }
  }, [showFavorites]);

  async function loadFavorites() {
    const items = await getFavorites();
    setFavorites(items);
    const c = await getFavoritesCount();
    setFavCount(c);
  }

  async function handleRemoveFavorite(product: any) {
    await toggleFavorite(product);
    await loadFavorites();
  }

  return (
    <View style={styles.container}>
      <SimpleHeader onCartPress={() => router.push("/tabs/cart")} />

      {!user ? (
        <NotLoggedView open={open} />
      ) : showFavorites ? (
        <FavoritesView
          favorites={favorites}
          onBack={() => setShowFavorites(false)}
          onRemoveFavorite={handleRemoveFavorite}
          onRefresh={loadFavorites}
        />
      ) : showSettings ? (
        <SettingsView
          user={user}
          onBack={() => setShowSettings(false)}
          onUpdateUser={async (updatedUser) => {
            await useUser.getState().setUser(updatedUser);
            setShowSettings(false);
          }}
        />
      ) : (
        <LoggedView
          user={user}
          cartCount={cartCount}
          favCount={favCount}
          onLogout={logout}
          onShowFavorites={() => setShowFavorites(true)}
          onShowSettings={() => setShowSettings(true)}
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

        <TouchableOpacity style={styles.primaryButton} onPress={() => open("login")}>
          <Ionicons name="log-in-outline" size={18} color="white" />
          <Text style={styles.primaryButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

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
function LoggedView({ user, cartCount, favCount, onLogout, onShowFavorites, onShowSettings }) {
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
        <ProfileButton
          icon="settings-outline"
          label="Configuración de Cuenta"
          onPress={onShowSettings}
        />

        <ProfileButton
          icon="heart-outline"
          label={`Mis Favoritos (${favCount})`}
          onPress={onShowFavorites}
        />

        <ProfileButton
          icon="cart-outline"
          label="Historial de Compras"
          onPress={() => router.push("/orders")}
        />

        <ProfileButton
          icon="log-out-outline"
          label="Cerrar Sesión"
          danger
          onPress={onLogout}
        />
      </View>
    </ScrollView>
  );
}

/* -------------------------
    FAVORITES VIEW
--------------------------- */
function FavoritesView({ favorites, onBack, onRemoveFavorite, onRefresh }) {
  // Estado vacío
  if (favorites.length === 0) {
    return (
      <View style={styles.favoritesContainer}>
        <View style={styles.favoritesHeader}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.favoritesTitle}>Mis Favoritos</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Ionicons name="heart-outline" size={64} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>No tienes favoritos aún</Text>
          <Text style={styles.emptyText}>
            Explora nuestra tienda y guarda tus productos favoritos
          </Text>
          <TouchableOpacity
            style={styles.exploreBtn}
            onPress={() => router.push("/tabs/home")}
          >
            <Text style={styles.exploreBtnText}>Explorar Productos</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.favoritesContainer}>
      <View style={styles.favoritesHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.favoritesTitle}>Mis Favoritos</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.favoritesSubheader}>
        <Text style={styles.favoritesSubtitle}>
          {favorites.length}{" "}
          {favorites.length === 1 ? "producto guardado" : "productos guardados"}
        </Text>
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.favoritesListContent}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ProductCard
              product={item}
              onPress={() => router.push(`/product/${item.id}`)}
              onFavorite={() => onRemoveFavorite(item)}
              onAddToCart={() => addToCart(item)}
            />
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => onRemoveFavorite(item)}
            >
              <Ionicons name="trash-outline" size={18} color={colors.danger} />
              <Text style={styles.removeBtnText}>Quitar</Text>
            </TouchableOpacity>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

/* -------------------------
    SETTINGS VIEW
--------------------------- */
function SettingsView({ user, onBack, onUpdateUser }) {
  const [username, setUsername] = useState(user.username);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  async function handleUpdateUsername() {
    if (!username.trim()) {
      setErrors({ username: "El nombre de usuario es requerido" });
      return;
    }
    if (username.length < 3) {
      setErrors({ username: "Mínimo 3 caracteres" });
      return;
    }
    if (username === user.username) {
      setSuccessMessage("No hay cambios en el nombre de usuario");
      setTimeout(() => setSuccessMessage(""), 3000);
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      await updateUsername(user.id, username);
      
      const updatedUser = { ...user, username };
      await onUpdateUser(updatedUser);
      
      Alert.alert("Éxito", "Nombre de usuario actualizado correctamente");
    } catch (error: any) {
      setErrors({ username: error.message || "Error al actualizar el nombre de usuario" });
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword() {
    const newErrors: typeof errors = {};

    if (!currentPassword) {
      newErrors.currentPassword = "La contraseña actual es requerida";
    }
    if (!newPassword) {
      newErrors.newPassword = "La nueva contraseña es requerida";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Mínimo 6 caracteres";
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      await changePassword(currentPassword, newPassword);
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      Alert.alert("Éxito", "Contraseña actualizada correctamente");
    } catch (error: any) {
      let friendly = "Error al cambiar la contraseña";
      if (error.code === "auth/wrong-password") {
        friendly = "La contraseña actual es incorrecta";
        setErrors({ currentPassword: friendly });
      } else if (error.code === "auth/weak-password") {
        friendly = "La nueva contraseña es muy débil";
        setErrors({ newPassword: friendly });
      } else {
        setErrors({ newPassword: friendly });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.settingsContainer}>
      <View style={styles.settingsHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.settingsTitle}>Configuración de Cuenta</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.settingsContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Información de la cuenta */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Información de la Cuenta</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={[styles.input, { color: colors.textSecondary }]}
                value={user.email}
                editable={false}
                placeholder="Email"
              />
              <Text style={styles.infoText}>El email no se puede cambiar</Text>
            </View>
          </View>

          {/* Editar nombre de usuario */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Nombre de Usuario</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nombre de usuario</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  if (errors.username) setErrors({ ...errors, username: undefined });
                }}
                placeholder="Tu nombre de usuario"
                autoCapitalize="none"
              />
              {errors.username && (
                <Text style={{ color: colors.danger, fontSize: 12, marginTop: 4 }}>
                  {errors.username}
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={[styles.saveButton, loading && { opacity: 0.6 }]}
              onPress={handleUpdateUsername}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>
                {loading ? "Guardando..." : "Guardar Cambios"}
              </Text>
            </TouchableOpacity>
            {successMessage && (
              <Text style={{ color: colors.success, fontSize: 12, marginTop: 8, textAlign: "center" }}>
                {successMessage}
              </Text>
            )}
          </View>

          {/* Cambiar contraseña */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>Cambiar Contraseña</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Contraseña Actual</Text>
              <View style={{ position: "relative" }}>
                <TextInput
                  style={styles.passwordInput}
                  value={currentPassword}
                  onChangeText={(text) => {
                    setCurrentPassword(text);
                    if (errors.currentPassword) setErrors({ ...errors, currentPassword: undefined });
                  }}
                  placeholder="Contraseña actual"
                  secureTextEntry={!showCurrentPassword}
                />
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    right: 12,
                    top: 12,
                  }}
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  <Ionicons
                    name={showCurrentPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {errors.currentPassword && (
                <Text style={{ color: colors.danger, fontSize: 12, marginTop: 4 }}>
                  {errors.currentPassword}
                </Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nueva Contraseña</Text>
              <View style={{ position: "relative" }}>
                <TextInput
                  style={styles.passwordInput}
                  value={newPassword}
                  onChangeText={(text) => {
                    setNewPassword(text);
                    if (errors.newPassword) setErrors({ ...errors, newPassword: undefined });
                  }}
                  placeholder="Nueva contraseña"
                  secureTextEntry={!showNewPassword}
                />
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    right: 12,
                    top: 12,
                  }}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  <Ionicons
                    name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {errors.newPassword && (
                <Text style={{ color: colors.danger, fontSize: 12, marginTop: 4 }}>
                  {errors.newPassword}
                </Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirmar Nueva Contraseña</Text>
              <View style={{ position: "relative" }}>
                <TextInput
                  style={styles.passwordInput}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                  }}
                  placeholder="Confirma la nueva contraseña"
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    right: 12,
                    top: 12,
                  }}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text style={{ color: colors.danger, fontSize: 12, marginTop: 4 }}>
                  {errors.confirmPassword}
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.saveButton, loading && { opacity: 0.6 }]}
              onPress={handleChangePassword}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>
                {loading ? "Cambiando..." : "Cambiar Contraseña"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

/* -------------------------
    REUSABLE BUTTON
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
      <Text style={[styles.optionText, danger && styles.optionTextDanger]}>
        {label}
      </Text>
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

  favoritesContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  favoritesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.xs,
  },
  favoritesTitle: {
    fontSize: fonts.title2,
    fontWeight: fonts.bold,
    color: colors.textPrimary,
  },
  favoritesSubheader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  favoritesSubtitle: {
    fontSize: fonts.body,
    color: colors.textSecondary,
  },
  favoritesListContent: {
    paddingBottom: 120,
  },
  cardWrapper: {
    position: "relative",
  },
  removeBtn: {
    position: "absolute",
    bottom: spacing.md + 8,
    right: spacing.lg + 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 4,
    ...{
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  },
  removeBtnText: {
    fontSize: 12,
    color: colors.danger,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  exploreBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: 30,
  },
  exploreBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  settingsContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  settingsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingsTitle: {
    fontSize: fonts.title2,
    fontWeight: fonts.bold,
    color: colors.textPrimary,
  },
  settingsContent: {
    padding: spacing.lg,
  },
  settingsSection: {
    backgroundColor: "white",
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fonts.subtitle,
    fontWeight: fonts.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: fonts.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fonts.body,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fonts.body,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  saveButton: {
    backgroundColor: colors.primaryDark,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
    marginTop: spacing.md,
  },
  saveButtonText: {
    color: "white",
    fontSize: fonts.body,
    fontWeight: fonts.semibold,
  },
  infoText: {
    fontSize: fonts.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontStyle: "italic",
  },
});
