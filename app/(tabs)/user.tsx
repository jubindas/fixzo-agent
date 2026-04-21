import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// --- TYPES ---

interface UserProfile {
  name: string;
  role: string;
  email: string;
  avatar: string;
}

interface MenuOptionProps {
  icon: keyof typeof Feather.glyphMap; // Type-safe Feather icon names
  title: string;
  subtitle?: string;
  color?: string;
  isLast?: boolean;
  onPress?: () => void;
}

// --- COMPONENT ---

export default function User() {
  // Mock User Data
  const user: UserProfile = {
    name: "Jubin Das",
    role: "Administrator",
    email: "jubin.das@example.com",
    avatar: "https://i.pravatar.cc/150?u=jubin",
  };

  // Internal Reusable Component with Types
  const MenuOption: React.FC<MenuOptionProps> = ({
    icon,
    title,
    subtitle,
    color = "#2563eb",
    isLast = false,
    onPress,
  }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        isLast && { borderBottomWidth: 0 },
        pressed && { opacity: 0.7 },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${color}10` }]}>
        <Feather name={icon} size={20} color={color} />
      </View>
      <View style={styles.menuTextContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <Feather name="chevron-right" size={18} color="#cbd5e1" />
    </Pressable>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* PROFILE HEADER */}
      <View style={styles.header}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Pressable style={styles.editBadge}>
            <Feather name="camera" size={14} color="#fff" />
          </Pressable>
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userRole}>{user.role}</Text>
      </View>

      {/* QUICK STATS */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Workers</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>4.8</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Projects</Text>
        </View>
      </View>

      {/* SETTINGS SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <View style={styles.menuCard}>
          <MenuOption
            icon="user"
            title="Personal Information"
            subtitle="Name, Email, Phone"
          />
          <MenuOption
            icon="shield"
            title="Security"
            subtitle="Password, Biometrics"
            color="#16a34a"
          />
          <MenuOption
            icon="bell"
            title="Notifications"
            subtitle="Push, Email, SMS"
            color="#ea580c"
            isLast={true}
          />
        </View>
      </View>

      {/* SUPPORT SECTION */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support & Legal</Text>
        <View style={styles.menuCard}>
          <MenuOption icon="help-circle" title="Help Center" color="#64748b" />
          <MenuOption icon="file-text" title="Privacy Policy" color="#64748b" />
          <MenuOption
            icon="log-in"
            title="Log In"
            color="#dc2626"
            isLast={true}
            onPress={() => router.push("/login")}
          />
        </View>
      </View>

      <Text style={styles.versionText}>Version 1.0.4 (2026)</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    alignItems: "center",
    paddingTop: 80,
    paddingBottom: 40,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#eff6ff",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2563eb",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
  },
  userRole: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: -25,
    borderRadius: 20,
    paddingVertical: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2563eb",
  },
  statLabel: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: "100%",
    backgroundColor: "#f1f5f9",
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#64748b",
    marginBottom: 12,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f8fafc",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  menuTextContent: {
    flex: 1,
    marginLeft: 14,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
  },
  menuSubtitle: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 1,
  },
  versionText: {
    textAlign: "center",
    color: "#cbd5e1",
    fontSize: 12,
    marginVertical: 30,
  },
});
