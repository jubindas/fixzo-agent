import { ROOT_URL } from "@/url";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface WorkerProfile {
  name: string;
  id: string;
  skill: string;
  rating: number;
  reviews: number;
  joined: string;
  daysRemaining: number;
  totalDays: number;
  image: string;
  location: string;
  totalHours: string;
}

interface DetailItemProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  valueColor?: string;
  isLast?: boolean;
}

const WORKER_DATA: WorkerProfile = {
  name: "Rahul Sharma",
  id: "EMP-9921",
  skill: "Senior Electrician",
  rating: 4.9,
  reviews: 128,
  joined: "Oct 2024",
  daysRemaining: 12,
  totalDays: 30,
  image: "https://i.pravatar.cc/150?u=1",
  location: "Guwahati, Assam",
  totalHours: "1,420 hrs",
};

export default function WorkerDetails() {

  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  
  const [userData, setUserData] = useState<any>(null);

  const worker = WORKER_DATA; 
  

  useEffect(() => {
    initializeProfile();
  }, []);


  const initializeProfile = async () => {
  
    
    try {
      const savedToken = await AsyncStorage.getItem("token-fixzo");
      if (!savedToken) {
        router.replace("/(auth)");
        return;
      }
      setToken(savedToken);
      await fetchWorkerProfile(savedToken);
    } catch (error) {
      Alert.alert("Initialization Error", "Failed to load profile settings.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWorkerProfile = async (authToken: string) => {
    try {
      const response = await axios.get(`${ROOT_URL}/user`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setUserData(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        handleLogoutAction(); 
      } else {
        console.error("Profile Fetch Error:", error);
      }
    }
  };

  const handleLogoutAction = async () => {
    try {
      await AsyncStorage.multiRemove(["token-fixzo", "user-fixzo"]);
      router.replace("/(auth)");
    } catch (error) {
      Alert.alert("Logout Error", "Unable to sign out completely.");
    }
  };

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to log out of Fixzo?", [
      { text: "Stay", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: handleLogoutAction,
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  console.log("the user data is", userData);

  const progress = (worker.daysRemaining / worker.totalDays) * 100;
  const isLowTime = worker.daysRemaining < 5;
  const statusColor = isLowTime ? "#ef4444" : "#2563eb";

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Section */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: worker.image }} style={styles.avatar} />
          <View style={styles.onlineIndicator} />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.workerName}>{worker.name}</Text>
          <Text style={styles.workerId}>
            {worker.id} • Joined {worker.joined}
          </Text>
          <View style={styles.ratingRow}>
            <View style={styles.starBadge}>
              <Ionicons name="star" size={12} color="#fff" />
              <Text style={styles.starText}>{worker.rating}</Text>
            </View>
            <Text style={styles.reviewText}>
              {worker.reviews} verified reviews
            </Text>
          </View>
        </View>
      </View>

      {/* Validity Card */}
      <View style={styles.statusCard}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardLabel}>Membership Validity</Text>
            <Text
              style={[
                styles.timeLarge,
                { color: isLowTime ? "#ef4444" : "#1e293b" },
              ]}
            >
              {worker.daysRemaining} Days{" "}
              <Text style={styles.timeLeftText}>left</Text>
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: isLowTime ? "#fef2f2" : "#f0fdf4" },
            ]}
          >
            <Text
              style={[
                styles.statusBadgeText,
                { color: isLowTime ? "#ef4444" : "#16a34a" },
              ]}
            >
              {isLowTime ? "EXPIRING SOON" : "ACTIVE"}
            </Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressBar,
              { width: `${progress}%`, backgroundColor: statusColor },
            ]}
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.renewBtn,
            pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
          ]}
        >
          <Text style={styles.renewBtnText}>Extend Membership</Text>
          <Feather name="zap" size={16} color="#fff" />
        </Pressable>
      </View>

      {/* Profile Details */}
      <Text style={styles.sectionTitle}>Professional Profile</Text>
      <View style={styles.detailCard}>
        <DetailItem
          icon="briefcase"
          label="Primary Skill"
          value={worker.skill}
        />
        <DetailItem
          icon="map-pin"
          label="Service Area"
          value={worker.location}
        />
        <DetailItem
          icon="shield"
          label="Verification"
          value="Background Checked"
          valueColor="#16a34a"
        />
        <DetailItem
          icon="clock"
          label="Experience"
          value={worker.totalHours}
          isLast={true}
        />
      </View>

      {/* Feedback Section */}
      <View style={styles.feedbackSection}>
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Client Feedback</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>
        <View style={styles.feedbackCard}>
          <View style={styles.quoteIcon}>
            <MaterialCommunityIcons
              name="format-quote-open"
              size={24}
              color="#2563eb"
            />
          </View>
          <Text style={styles.feedbackQuote}>
            Rahul is incredibly precise with his work. He fixed the main breaker
            panel and explained the safety measures clearly. Highly recommend!
          </Text>
          <View style={styles.feedbackFooter}>
            <Text style={styles.feedbackUser}>Amit Khurana</Text>
            <Text style={styles.feedbackDate}>2 days ago</Text>
          </View>
        </View>
      </View>

      {/* Footer / Logout */}
      <View style={styles.logoutContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.logoutBtn,
            pressed && { backgroundColor: "#fef2f2" },
          ]}
          onPress={handleLogout}
        >
          <Feather name="log-out" size={18} color="#ef4444" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>
        <Text style={styles.footerVersion}>App Version 1.0.4 • Build 2026</Text>
      </View>
    </ScrollView>
  );
}

const DetailItem: React.FC<DetailItemProps> = ({
  icon,
  label,
  value,
  valueColor = "#1e293b",
  isLast = false,
}) => (
  <View style={[styles.detailItem, isLast && { borderBottomWidth: 0 }]}>
    <View style={styles.detailIconBg}>
      <Feather name={icon} size={16} color="#2563eb" />
    </View>
    <View style={styles.detailTextContainer}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, { color: valueColor }]}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: "#e2e8f0",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#22c55e",
    borderWidth: 3,
    borderColor: "#f8fafc",
  },
  headerInfo: {
    marginLeft: 18,
    flex: 1,
  },
  workerName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  workerId: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 2,
    fontWeight: "500",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  starBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f59e0b",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  starText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  reviewText: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "500",
  },
  statusCard: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#2563eb",
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
    marginBottom: 30,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  cardLabel: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  timeLarge: {
    fontSize: 32,
    fontWeight: "900",
    marginTop: 4,
  },
  timeLeftText: {
    fontSize: 16,
    color: "#94a3b8",
    fontWeight: "600",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "800",
  },
  progressTrack: {
    height: 10,
    backgroundColor: "#f1f5f9",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 24,
  },
  progressBar: {
    height: "100%",
    borderRadius: 5,
  },
  renewBtn: {
    backgroundColor: "#2563eb",
    flexDirection: "row",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  renewBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 16,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seeAll: {
    color: "#2563eb",
    fontSize: 13,
    fontWeight: "700",
  },
  detailCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    marginBottom: 30,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#f8fafc",
  },
  detailIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
  },
  detailTextContainer: {
    marginLeft: 16,
  },
  detailLabel: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 2,
  },
  feedbackSection: {
    marginBottom: 30,
  },
  feedbackCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  quoteIcon: {
    marginBottom: 8,
    marginLeft: -8,
  },
  feedbackQuote: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 24,
    fontWeight: "500",
  },
  feedbackFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  feedbackUser: {
    fontSize: 14,
    color: "#1e293b",
    fontWeight: "700",
  },
  feedbackDate: {
    fontSize: 12,
    color: "#94a3b8",
  },
  logoutContainer: {
    marginTop: 10,
    marginBottom: 80,
    alignItems: "center",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#fee2e2",
    gap: 10,
  },
  logoutText: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "700",
  },
  footerVersion: {
    fontSize: 12,
    color: "#cbd5e1",
    marginTop: 16,
    fontWeight: "500",
  },
});
