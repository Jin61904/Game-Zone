import { useAuthModal } from "@/lib/authModalStore";
import { useUser } from "@/lib/userStore";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();
  const { user, logout } = useUser();
  const { open } = useAuthModal();

  const goToApp = () => {
    router.replace('/tabs/home');
  };

  return (
    <LinearGradient colors={['#B87CFF', '#7C4DFF']} style={styles.gradient}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>

          {/* Icono redondo */}
          <View style={styles.iconWrapper}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="gamepad-variant" size={42} color="#FFF" />
            </View>
          </View>

          {/* Título */}
          <Text style={styles.title}>GameZone</Text>
          <Text style={styles.subtitle}>
            Tu tienda gaming favorita. Descubre las mejores consolas y videojuegos.
          </Text>

          {/* Si el usuario YA inició sesión */}
          {user ? (
            <View style={styles.loggedBox}>
              <Text style={styles.loggedText}>¡Bienvenido de vuelta!</Text>
              <Text style={styles.loggedName}>{user.username}</Text>

              <TouchableOpacity
                style={[styles.primaryButton, { marginTop: 24 }]}
                onPress={goToApp}
              >
                <Text style={styles.primaryButtonText}>Continuar Gaming</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryOutlineBtn}
                onPress={logout}
              >
                <Text style={styles.secondaryOutlineText}>Cambiar usuario</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.buttonsContainer}>

              {/* Iniciar sesión */}
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => open("login")}
              >
                <MaterialCommunityIcons
                  name="gamepad-variant"
                  size={18}
                  color="#6B3FE2"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.primaryButtonTextPurple}>Iniciar Sesión</Text>
              </TouchableOpacity>

              {/* Crear cuenta */}
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => open("register")}
              >
                <Text style={styles.secondaryButtonText}>Crear Cuenta Nueva</Text>
              </TouchableOpacity>

              {/* Continuar sin login */}
              <TouchableOpacity style={styles.ghostButton} onPress={goToApp}>
                <Text style={styles.ghostText}>Continuar sin cuenta</Text>
              </TouchableOpacity>

            </View>
          )}

        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrapper: { marginBottom: 40 },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    marginBottom: 32,
  },
  buttonsContainer: {
    width: "100%",
    alignItems: "center",
  },
  primaryButton: {
    flexDirection: "row",
    width: "100%",
    height: 52,
    borderRadius: 999,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  primaryButtonTextPurple: {
    color: "#6B3FE2",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    width: "100%",
    height: 52,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  secondaryButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "500",
  },
  ghostButton: { paddingVertical: 4 },
  ghostText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
  },
  loggedBox: {
    width: "100%",
    marginTop: 8,
    alignItems: "center",
  },
  loggedText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
  },
  loggedName: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
  },
  secondaryOutlineBtn: {
    width: "100%",
    height: 48,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  secondaryOutlineText: {
    color: "#FFF",
    fontSize: 15,
  },
});
