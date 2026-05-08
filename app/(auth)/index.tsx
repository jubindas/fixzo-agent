import { ROOT_URL } from "@/url";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import {
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Role = "Agent" | "Worker";

export default function Login() {
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState<Role>("Agent");

  const [email, setEmail] = useState<string>("");

  const [password, setPassword] = useState<string>("");

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const isValid = email.trim() !== "" && password.trim().length >= 6;

  const handleLogin = async () => {
    if (!isValid) return;
    setIsLoading(true);
    try {
      const response = await axios.post(`${ROOT_URL}/login`, {
        login: email,
        password,
      });

      await AsyncStorage.setItem("token-fixzo", response.data.access_token);
      await AsyncStorage.setItem(
        "user-fixzo",
        JSON.stringify(response.data.user),
      );

     const user = response.data?.user;

if (user?.role?.name === "agent") {

  router.replace("/(tabs)");

} else if (user?.role_name === "worker") {

  router.replace("/worker");

} else {

  Alert.alert(
    "Authentication Failed",
    "You're not authenticated to access this app."
  );

}
    } catch (error: any) {
      const userMessage =
        error.response?.data?.message ||
        "Invalid credentials. Please try again.";
      Alert.alert("Login Failed", userMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <ShieldCheck color="#2563eb" size={32} strokeWidth={2.5} />
            </View>
          </View>
          <Text style={styles.heading}>Fixzo Portal</Text>
          <Text style={styles.subheading}>
            Secure access for authorized personnel
          </Text>
        </View>

        <View style={styles.rolePicker}>
          {(["Agent", "Worker"] as Role[]).map((role) => {
            const active = selectedRole === role;
            return (
              <Pressable
                key={role}
                onPress={() => setSelectedRole(role)}
                style={[styles.roleTab, active && styles.roleTabActive]}
              >
                <Text
                  style={[
                    styles.roleTabText,
                    active && styles.roleTabTextActive,
                  ]}
                >
                  {role}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email Address</Text>
          <View
            style={[
              styles.inputContainer,
              focusedInput === "email" && styles.inputContainerFocused,
            ]}
          >
            <Mail
              size={18}
              color={focusedInput === "email" ? "#2563eb" : "#94a3b8"}
            />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#cbd5e1"
              style={styles.input}
              editable={true}
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View
            style={[
              styles.inputContainer,
              focusedInput === "password" && styles.inputContainerFocused,
            ]}
          >
            <Lock
              size={18}
              color={focusedInput === "password" ? "#2563eb" : "#94a3b8"}
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry={!isPasswordVisible}
              placeholderTextColor="#cbd5e1"
              style={styles.input}
            />
            <Pressable
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={styles.eyeButton}
            >
              {isPasswordVisible ? (
                <EyeOff size={20} color="#64748b" />
              ) : (
                <Eye size={20} color="#64748b" />
              )}
            </Pressable>
          </View>

          <Pressable
            onPress={handleLogin}
            disabled={!isValid || isLoading}
            style={({ pressed }) => [
              styles.loginButton,
              (!isValid || isLoading) && styles.loginButtonDisabled,
              pressed && styles.loginButtonPressed,
            ]}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.loginButtonContent}>
                <Text style={styles.loginButtonText}>Sign In</Text>
                <ChevronRight size={20} color="#fff" />
              </View>
            )}
          </Pressable>

          {selectedRole === "Worker" && (
            <View style={styles.footer}>
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>NEW HERE?</Text>
                <View style={styles.dividerLine} />
              </View>

              <Pressable
                style={styles.registerButton}
                onPress={() => router.push("/register-worker")}
              >
                <Text style={styles.registerButtonText}>
                  Register as Worker
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc", // Very light blue/gray background
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 24,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 15,
    color: "#64748b",
    marginTop: 6,
    textAlign: "center",
  },
  rolePicker: {
    flexDirection: "row",
    backgroundColor: "#e2e8f0",
    borderRadius: 14,
    padding: 4,
    marginBottom: 32,
  },
  roleTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
  },
  roleTabActive: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  roleTabText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748b",
  },
  roleTabTextActive: {
    color: "#2563eb",
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 8,
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    marginBottom: 20,
    paddingHorizontal: 16,
    height: 58,
  },
  inputContainerFocused: {
    borderColor: "#2563eb",
    backgroundColor: "#ffffff",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1e293b",
    marginLeft: 12,
    fontWeight: "500",
  },
  eyeButton: {
    padding: 4,
  },
  loginButton: {
    backgroundColor: "#2563eb",
    borderRadius: 16,
    height: 58,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  loginButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.95,
  },
  loginButtonDisabled: {
    backgroundColor: "#cbd5e1",
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
  },
  footer: {
    marginTop: 32,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e2e8f0",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#94a3b8",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  registerButton: {
    height: 58,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    backgroundColor: "transparent",
  },
  registerButtonText: {
    color: "#475569",
    fontSize: 16,
    fontWeight: "700",
  },
});
