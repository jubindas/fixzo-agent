import { ROOT_URL } from "@/url";

import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";

import { useRouter } from "expo-router";

import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function WorkerDetails() {
  
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);

  const [userData, setUserData] = useState<any>(null);

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
      await fetchWorkerProfile(savedToken);
    } catch (error) {
      console.log("the error is", error);

      Alert.alert("Error", "Failed to load profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWorkerProfile = async (authToken: string) => {
    try {
      const response = await axios.get(`${ROOT_URL}/user`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      // Assuming response.data contains the JSON structure you provided
      setUserData(response.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        handleLogoutAction();
      }
    }
  };

  const handleLogoutAction = async () => {
    await AsyncStorage.multiRemove(["token-fixzo", "user-fixzo"]);
    router.replace("/(auth)");
  };

  if (isLoading || !userData) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const expiryDate = new Date(userData.worker_profile.ilp_expiry_date);

  const today = new Date();

  const daysLeft = Math.max(
    0,
    Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24)),
  );

  const progress = Math.min(100, (daysLeft / 30) * 100); // Assuming 30-day cycles

  const isLowTime = daysLeft < 7;

  console.log("tuser", JSON.stringify(userData, null, 2));

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.headerCard}>
        <View style={styles.profileRow}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: `https://ui-avatars.com/api/?name=${userData.name}&background=0D8ABC&color=fff`,
              }}
              style={styles.avatar}
            />
            <View style={styles.verifiedBadge}>
              <MaterialCommunityIcons
                name="check-decagram"
                size={18}
                color="#2563eb"
              />
            </View>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.userName}>
              {userData.worker_profile.full_name}
            </Text>
            <Text style={styles.userRole}>
              {userData.role_name.toUpperCase()}
            </Text>
            <View style={styles.locationTag}>
              <Feather name="map-pin" size={12} color="#64748b" />
              <Text style={styles.locationText}>
                {userData.worker_profile.city.name},{" "}
                {userData.worker_profile.permanent_pincode}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Validity Section */}
      <View style={styles.validityCard}>
        <View style={styles.validityHeader}>
          <Text style={styles.validityTitle}>ID Validity</Text>
          <View
            style={[
              styles.statusTag,
              { backgroundColor: isLowTime ? "#fff1f2" : "#f0fdf4" },
            ]}
          >
            <Text
              style={[
                styles.statusTagText,
                { color: isLowTime ? "#e11d48" : "#16a34a" },
              ]}
            >
              {isLowTime ? "Renew Soon" : "Active"}
            </Text>
          </View>
        </View>

        <Text
          style={[
            styles.daysText,
            { color: isLowTime ? "#e11d48" : "#1e293b" },
          ]}
        >
          {daysLeft} <Text style={styles.daysSub}>Days Remaining</Text>
        </Text>

        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${progress}%`,
                backgroundColor: isLowTime ? "#e11d48" : "#2563eb",
              },
            ]}
          />
        </View>
      </View>

      {/* Professional Info */}
      <Text style={styles.sectionLabel}>Work Information</Text>
      <View style={styles.infoGrid}>
        <InfoTile
          icon="briefcase"
          label="Category"
          value={userData.worker_profile.category.name}
        />
        <InfoTile
          icon="file-text"
          label="KYC Type"
          value={userData.worker_profile.kyc_document_type.toUpperCase()}
        />
        <InfoTile
          icon="phone"
          label="Alternative"
          value={userData.worker_profile.alternative_number || "N/A"}
        />
        <InfoTile
          icon="user"
          label="Guardian"
          value={`${userData.worker_profile.guardian_name} (${userData.worker_profile.guardian_relation})`}
        />
      </View>

      {/* Address Section */}
      <View style={styles.addressCard}>
        <Feather name="home" size={20} color="#2563eb" />
        <View style={styles.addressRight}>
          <Text style={styles.addressLabel}>Present Address</Text>
          <Text style={styles.addressValue}>
            {userData.worker_profile.present_address}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <Pressable style={styles.logoutBtn} onPress={handleLogoutAction}>
          <Feather name="log-out" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const InfoTile = ({ icon, label, value }: any) => (
  <View style={styles.tile}>
    <View style={styles.tileIcon}>
      <Feather name={icon} size={16} color="#2563eb" />
    </View>
    <Text style={styles.tileLabel}>{label}</Text>
    <Text style={styles.tileValue} numberOfLines={1}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbfcfd", padding: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerCard: { marginTop: 40, marginBottom: 20 },
  profileRow: { flexDirection: "row", alignItems: "center" },
  avatarWrapper: { position: "relative" },
  avatar: {
    width: 85,
    height: 85,
    borderRadius: 30,
    backgroundColor: "#e2e8f0",
  },
  verifiedBadge: {
    position: "absolute",
    right: -5,
    bottom: -5,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 2,
  },
  nameContainer: { marginLeft: 20, flex: 1 },
  userName: { fontSize: 24, fontWeight: "800", color: "#1e293b" },
  userRole: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
    letterSpacing: 1,
    marginVertical: 4,
  },
  locationTag: { flexDirection: "row", alignItems: "center", gap: 4 },
  locationText: { fontSize: 13, color: "#64748b" },
  validityCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 25,
  },
  validityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  validityTitle: { fontSize: 14, fontWeight: "600", color: "#64748b" },
  statusTag: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  statusTagText: { fontSize: 11, fontWeight: "700" },
  daysText: { fontSize: 32, fontWeight: "800", marginVertical: 10 },
  daysSub: { fontSize: 16, fontWeight: "400", color: "#94a3b8" },
  progressContainer: {
    height: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: { height: "100%" },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 15,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  tile: {
    width: (width - 52) / 2,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  tileIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  tileLabel: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  tileValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
    marginTop: 2,
  },
  addressCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 20,
    marginTop: 20,
    alignItems: "center",
    gap: 15,
  },
  addressRight: { flex: 1 },
  addressLabel: { fontSize: 12, color: "#94a3b8", fontWeight: "600" },
  addressValue: { fontSize: 14, color: "#334155", fontWeight: "500" },
  footer: { marginTop: 40, marginBottom: 60 },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#fee2e2",
    gap: 10,
  },
  logoutText: { color: "#ef4444", fontSize: 16, fontWeight: "700" },
});
