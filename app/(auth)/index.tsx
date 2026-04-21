import { ROOT_URL } from "@/url";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Link, useRouter } from "expo-router";
import { ChevronRight, Eye, EyeOff, Lock, Mail } from "lucide-react-native";
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
  const [email, setEmail] = useState<string>("jubin@gmail.com");
  const [password, setPassword] = useState<string>("12345678");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

      router.push(
        response.data?.user?.role?.name === "agent" ? "/(tabs)" : "/worker",
      );
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
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoPlaceholder}>
            <Lock color="#2563eb" size={32} />
          </View>
          <Text style={styles.heading}>Welcome Back</Text>
          <Text style={styles.subheading}>
            Please enter your details to sign in
          </Text>
        </View>

        {/* Role Selector (Segmented Control style) */}
        <View style={styles.roleContainer}>
          {(["Agent", "Worker"] as Role[]).map((role) => {
            const active = selectedRole === role;
            return (
              <Pressable
                key={role}
                onPress={() => setSelectedRole(role)}
                style={[styles.roleButton, active && styles.roleButtonActive]}
              >
                <Text
                  style={[styles.roleText, active && styles.roleTextActive]}
                >
                  {role}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Input Card */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <Mail size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="name@company.com"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#94a3b8"
              style={styles.input}
            />
          </View>

          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputWrapper}>
            <Lock size={20} color="#94a3b8" style={styles.inputIcon} />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry={!isPasswordVisible}
              placeholderTextColor="#94a3b8"
              style={styles.input}
            />
            <Pressable
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={styles.eyeIcon}
            >
              {isPasswordVisible ? (
                <EyeOff size={20} color="#64748b" />
              ) : (
                <Eye size={20} color="#64748b" />
              )}
            </Pressable>
          </View>

          <Pressable style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </Pressable>

          {/* Action Buttons */}
          <Pressable
            onPress={handleLogin}
            disabled={!isValid || isLoading}
            style={({ pressed }) => [
              styles.primaryButton,
              (!isValid || isLoading) && styles.disabledButton,
              pressed && styles.buttonPressed,
            ]}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.buttonInner}>
                <Text style={styles.primaryButtonText}>Sign In</Text>
                <ChevronRight size={20} color="#fff" />
              </View>
            )}
          </Pressable>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.divider} />
          </View>

          <Link href="/register-worker" asChild>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>
                Create Worker Account
              </Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1e293b",
  },
  subheading: {
    fontSize: 15,
    color: "#64748b",
    marginTop: 8,
  },
  roleContainer: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    padding: 4,
    marginBottom: 32,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  roleButtonActive: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  roleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  roleTextActive: {
    color: "#2563eb",
  },
  inputSection: {
    width: "100%",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 16,
    color: "#1e293b",
  },
  eyeIcon: {
    padding: 8,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "600",
  },
  primaryButton: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  disabledButton: {
    backgroundColor: "#94a3b8",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#e2e8f0",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#94a3b8",
    fontSize: 14,
  },
  secondaryButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  secondaryButtonText: {
    color: "#475569",
    fontSize: 16,
    fontWeight: "600",
  },
});
