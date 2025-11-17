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
import type { User } from '../index';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register';
  onSuccess: (user: User) => void;
}

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

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  mode,
  onSuccess,
}) => {
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

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
    }

    if (mode === 'register') {
      if (!formData.username) {
        newErrors.username = 'El nombre de usuario es requerido';
      } else if (formData.username.length < 3) {
        newErrors.username = 'Mínimo 3 caracteres';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirma tu contraseña';
      } else if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }

      if (!formData.acceptTerms) {
        newErrors.acceptTerms = 'Debes aceptar los términos';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    setLoading(true);

    setTimeout(() => {
      const username =
        formData.username || formData.email.split('@')[0];

      const userData: User = {
        id: Math.random().toString(36).slice(2),
        email: formData.email,
        username,
      };

      onSuccess(userData);
      setLoading(false);
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        username: '',
        acceptTerms: false,
      });
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
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
                {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta Gamer'}
              </Text>
              <Text style={styles.headerSubtitle}>
                {mode === 'login'
                  ? 'Accede a tu cuenta para disfrutar ofertas exclusivas'
                  : 'Únete a la comunidad gaming más grande'}
              </Text>
            </View>

            {/* Formulario */}
            <ScrollView
              contentContainerStyle={styles.formContainer}
              keyboardShouldPersistTaps="handled"
            >
              {mode === 'register' && (
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
                      onChangeText={text => handleChange('username', text)}
                    />
                  </View>
                  {errors.username && (
                    <Text style={styles.errorText}>{errors.username}</Text>
                  )}
                </View>
              )}

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
                    placeholder="tu@email.com"
                    placeholderTextColor="#9CA3AF"
                    value={formData.email}
                    onChangeText={text => handleChange('email', text)}
                  />
                </View>
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

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
                    onChangeText={text => handleChange('password', text)}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(prev => !prev)}
                    style={styles.eyeBtn}
                  >
                    <MaterialCommunityIcons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>

              {mode === 'register' && (
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
                      onChangeText={text =>
                        handleChange('confirmPassword', text)
                      }
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirm(prev => !prev)}
                      style={styles.eyeBtn}
                    >
                      <MaterialCommunityIcons
                        name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                        size={18}
                        color="#9CA3AF"
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.confirmPassword && (
                    <Text style={styles.errorText}>
                      {errors.confirmPassword}
                    </Text>
                  )}
                </View>
              )}

              {mode === 'register' && (
                <View style={styles.termsRow}>
                  <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() =>
                      handleChange('acceptTerms', !formData.acceptTerms)
                    }
                  >
                    {formData.acceptTerms && (
                      <View style={styles.checkboxInner} />
                    )}
                  </TouchableOpacity>
                  <Text style={styles.termsText}>
                    Acepto los{' '}
                    <Text style={styles.termsLink}>términos y condiciones</Text>{' '}
                    y la{' '}
                    <Text style={styles.termsLink}>política de privacidad</Text>.
                  </Text>
                </View>
              )}
              {errors.acceptTerms && (
                <Text style={[styles.errorText, { marginTop: 4 }]}>
                  {errors.acceptTerms}
                </Text>
              )}

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
                      {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {mode === 'login' && (
                <TouchableOpacity style={styles.linkCenter}>
                  <Text style={styles.forgotText}>
                    ¿Olvidaste tu contraseña?
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

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
  field: {
    marginTop: 12,
  },
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
  inputIcon: {
    marginRight: 4,
  },
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
  linkCenter: {
    marginTop: 8,
    alignItems: 'center',
  },
  forgotText: {
    fontSize: 13,
    color: '#7C3AED',
  },
});
