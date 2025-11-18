import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuthModal } from "@/lib/authModalStore";
import { useUser } from "@/lib/userStore";
import { loginUser, registerUser } from "@/services/authService"; // ⭐ usar API real

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  acceptTerms: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  username?: string;
  acceptTerms?: string;
}

export const AuthModal = () => {
  const { isOpen, mode, close } = useAuthModal();
  const { setUser } = useUser();

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) newErrors.email = "El email es requerido";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email inválido";

    if (!formData.password) newErrors.password = "La contraseña es requerida";
    else if (formData.password.length < 6)
      newErrors.password = "Mínimo 6 caracteres";

    if (mode === "register") {
      if (!formData.username) newErrors.username = "El nombre de usuario es requerido";

      if (!formData.confirmPassword)
        newErrors.confirmPassword = "Confirma tu contraseña";

      if (formData.confirmPassword !== formData.password)
        newErrors.confirmPassword = "Las contraseñas no coinciden";

      if (!formData.acceptTerms)
        newErrors.acceptTerms = "Debes aceptar los términos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**  ⭐⭐ AQUÍ CAMBIA TODO — AHORA USA EL SERVICIO REAL ⭐⭐ */
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      let response;

      if (mode === "login") {
        response = await loginUser(formData.email, formData.password);
      } else {
        response = await registerUser(
          formData.email,
          formData.password,
          formData.username,
        );
      }

      // Guardar usuario globalmente
      await setUser(response.user);

      // Cerrar modal
      close();

      // Limpiar formulario
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        username: '',
        acceptTerms: false,
      });

    } catch (error: any) {
      console.log("❌ Error Auth:", error.message);

      setErrors({
        email: "Error: " + (error.message || "Inténtalo de nuevo"),
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible animationType="slide" transparent onRequestClose={close}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.flex}
        >
          <View style={styles.card}>
            <ScrollView
              contentContainerStyle={styles.formContainer}
              keyboardShouldPersistTaps="handled"
            >
              {/* HEADER */}
              <View style={styles.header}>
                <TouchableOpacity style={styles.closeBtn} onPress={close}>
                  <MaterialCommunityIcons name="close" size={20} color="#6B7280" />
                </TouchableOpacity>

                <View style={styles.headerIconWrapper}>
                  <View style={styles.headerIconCircle}>
                    <MaterialCommunityIcons
                      name="gamepad-variant"
                      size={28}
                      color="#FFFFFF"
                    />
                  </View>
                </View>

                <Text style={styles.headerTitle}>
                  {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta Gamer"}
                </Text>

                <Text style={styles.headerSubtitle}>
                  {mode === "login"
                    ? "Accede a tu cuenta para ofertas exclusivas"
                    : "Únete a la comunidad gaming"}
                </Text>
              </View>

              {/* USERNAME */}
              {mode === "register" && (
                <View style={styles.field}>
                  <Text style={styles.label}>Nombre de usuario</Text>
                  <View style={styles.inputRow}>
                    <MaterialCommunityIcons
                      name="account-outline"
                      size={18}
                      color="#9CA3AF"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Tu nombre gamer"
                      placeholderTextColor="#9CA3AF"
                      value={formData.username}
                      onChangeText={text => handleChange("username", text)}
                    />
                  </View>
                </View>
              )}

              {/* EMAIL */}
              <View style={styles.field}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputRow}>
                  <MaterialCommunityIcons
                    name="email-outline"
                    size={18}
                    color="#9CA3AF"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="tucorreo@email.com"
                    placeholderTextColor="#9CA3AF"
                    value={formData.email}
                    onChangeText={text => handleChange("email", text)}
                  />
                </View>
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              {/* PASSWORD */}
              <View style={styles.field}>
                <Text style={styles.label}>Contraseña</Text>
                <View style={styles.inputRow}>
                  <MaterialCommunityIcons
                    name="lock-outline"
                    size={18}
                    color="#9CA3AF"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    secureTextEntry={!showPassword}
                    placeholder="Tu contraseña"
                    placeholderTextColor="#9CA3AF"
                    value={formData.password}
                    onChangeText={text => handleChange("password", text)}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(prev => !prev)}
                    style={styles.eyeBtn}
                  >
                    <MaterialCommunityIcons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={18}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>

              {/* CONFIRM PASSWORD */}
              {mode === "register" && (
                <View style={styles.field}>
                  <Text style={styles.label}>Confirmar contraseña</Text>
                  <View style={styles.inputRow}>
                    <MaterialCommunityIcons
                      name="lock-outline"
                      size={18}
                      color="#9CA3AF"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      secureTextEntry={!showConfirm}
                      placeholder="Confirma tu contraseña"
                      placeholderTextColor="#9CA3AF"
                      value={formData.confirmPassword}
                      onChangeText={text => handleChange("confirmPassword", text)}
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirm(prev => !prev)}
                      style={styles.eyeBtn}
                    >
                      <MaterialCommunityIcons
                        name={showConfirm ? "eye-off-outline" : "eye-outline"}
                        size={18}
                        color="#9CA3AF"
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.confirmPassword && (
                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                  )}
                </View>
              )}

              {/* TERMS */}
              {mode === "register" && (
                <View style={styles.termsRow}>
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() =>
                      handleChange("acceptTerms", !formData.acceptTerms)
                    }
                  >
                    {formData.acceptTerms && (
                      <View style={styles.checkboxInner} />
                    )}
                  </TouchableOpacity>
                  <Text style={styles.termsText}>
                    Acepto los <Text style={styles.termsLink}>términos y condiciones</Text> y la{" "}
                    <Text style={styles.termsLink}>política de privacidad</Text>.
                  </Text>
                </View>
              )}
              {errors.acceptTerms && (
                <Text style={[styles.errorText, { marginTop: 4 }]}>
                  {errors.acceptTerms}
                </Text>
              )}

              {/* SUBMIT */}
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <Text style={styles.submitText}>Cargando...</Text>
                ) : (
                  <>
                    <MaterialCommunityIcons
                      name="gamepad-variant"
                      size={18}
                      color="#FFFFFF"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.submitText}>
                      {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

/* ⭐⭐ Tus estilos completos tal como los tenías ⭐⭐ */
const styles = StyleSheet.create({
  flex: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingBottom: 16,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  header: {
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 20,
  },
  closeBtn: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 4,
  },
  headerIconWrapper: {
    alignItems: 'center',
    marginBottom: 8,
  },
  headerIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  field: { marginTop: 12 },
  label: {
    fontSize: 13,
    marginBottom: 4,
    color: '#374151',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    height: 44,
  },
  inputIcon: { marginRight: 4 },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  eyeBtn: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 11,
    marginTop: 4,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 14,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#9CA3AF',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: '#8B5CF6',
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: '#4B5563',
  },
  termsLink: {
    color: '#7C3AED',
    textDecorationLine: 'underline',
  },
  submitBtn: {
    marginTop: 18,
    height: 48,
    borderRadius: 999,
    backgroundColor: '#8B5CF6',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
