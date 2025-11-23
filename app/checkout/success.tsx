import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SuccessScreen() {
  return (
    <View style={styles.container}>
      
      {/* Icono verde */}
      <View style={styles.iconCircle}>
        <Text style={styles.check}>✔</Text>
      </View>

      <Text style={styles.title}>¡Compra Exitosa!</Text>

      <Text style={styles.subtitle}>
        Tu pedido ha sido procesado correctamente. Recibirás un email de 
        confirmación pronto.
      </Text>

      <TouchableOpacity
        onPress={() => router.push("/tabs/home")}
        style={styles.buttonWrapper}
      >
        <LinearGradient
          colors={["#A78BFA", "#7C3AED"]}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Continuar Comprando</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#22C55E33",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  check: {
    fontSize: 50,
    color: "#22C55E",
    fontWeight: "bold",
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 30,
  },

  buttonWrapper: {
    width: "70%",
  },

  button: {
    paddingVertical: 14,
    borderRadius: 12,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
