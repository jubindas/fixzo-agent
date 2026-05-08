import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

interface UserProfile {
  name: string;
  role: string;
  email: string;
  avatar: string;
}

interface MenuOptionProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle?: string;
  color?: string;
  isLast?: boolean;
  onPress?: () => void;
}

export default function User() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [user, setUser] = useState<UserProfile>({
    name: "Guest User",
    role: "Not Logged In",
    email: "",
    avatar: "https://i.pravatar.cc/150?u=guest",
  });

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {

      const token = await AsyncStorage.getItem("token-fixzo");

      const storedUser = await AsyncStorage.getItem("user-fixzo");

      if (token) {
        setIsLoggedIn(true);

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);


          console.log("the agent is", JSON.stringify(parsedUser, null, 2))

          setUser({
            name: parsedUser?.name || "User",
            role: parsedUser?.role?.name || "User",
            email: parsedUser?.email || "",
            avatar:
              parsedUser?.avatar ||
              "https://i.pravatar.cc/150?u=user",
          });
        }
      } else {
        setIsLoggedIn(false);
      }

    } catch (error) {
      console.log("Error checking login:", error);
    }
  };

  const handleLogout = async () => {
    try {

      await AsyncStorage.removeItem("token-fixzo");

      await AsyncStorage.removeItem("user-fixzo");

      setIsLoggedIn(false);

      setUser({
        name: "Guest User",
        role: "Not Logged In",
        email: "",
        avatar: "https://i.pravatar.cc/150?u=guest",
      });

      router.replace("/(auth)");

    } catch (error) {
      console.log("Logout Error:", error);
    }
  };

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
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: `${color}10` },
        ]}
      >
        <Feather name={icon} size={20} color={color} />
      </View>

      <View style={styles.menuTextContent}>
        <Text style={styles.menuTitle}>{title}</Text>

        {subtitle && (
          <Text style={styles.menuSubtitle}>
            {subtitle}
          </Text>
        )}
      </View>

      <Feather
        name="chevron-right"
        size={18}
        color="#cbd5e1"
      />
    </Pressable>
  );

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >

    <View style={styles.header}>

  <View style={styles.profileIconContainer}>
    <Feather
      name="user"
      size={42}
      color="#2563eb"
    />
  </View>

  <Text style={styles.userName}>
    {user.name}
  </Text>

  <Text style={styles.userRole}>
    {user.role}
  </Text>

</View>

      {/* STATS */}
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

      {/* ACCOUNT SETTINGS */}
      <View style={styles.section}>

        <Text style={styles.sectionTitle}>
          Account Settings
        </Text>

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

      {/* SUPPORT */}
      <View style={styles.section}>

        <Text style={styles.sectionTitle}>
          Support & Legal
        </Text>

        <View style={styles.menuCard}>

          <MenuOption
            icon="help-circle"
            title="Help Center"
            color="#64748b"
          />

          <MenuOption
            icon="file-text"
            title="Privacy Policy"
            color="#64748b"
          />

          {isLoggedIn ? (
            <MenuOption
              icon="log-out"
              title="Logout"
              subtitle="Sign out from account"
              color="#dc2626"
              isLast={true}
              onPress={handleLogout}
            />
          ) : (
            <MenuOption
              icon="log-in"
              title="Log In"
              subtitle="Access your account"
              color="#16a34a"
              isLast={true}
              onPress={() => router.push("/(auth)")}
            />
          )}

        </View>

      </View>

      <Text style={styles.versionText}>
        Version 1.0.4 (2026)
      </Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  profileIconContainer: {
  width: 90,
  height: 90,
  borderRadius: 45,
  backgroundColor: "#eff6ff",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 16,
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