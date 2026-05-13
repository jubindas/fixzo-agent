import { ROOT_URL } from "@/url";

import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";

import { useRouter } from "expo-router";

import React, { useCallback, useEffect, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Worker = {
  id: number;
  name: string;
  phone_number: string;
  created_at: string;
  worker_profile: {
    full_name: string;
    work_description: string;
    guardian_name: string;
    guardian_relation: string;
    district?: { name: string };
  };
};

export default function Index() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");

  const [workers, setWorkers] = useState<Worker[]>([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [token, setToken] = useState<string | null>(null);

  const fetchWorkers = async (authToken: string) => {
    try {
      const response = await axios.get(`${ROOT_URL}/workers`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      });
      setWorkers(Array.isArray(response.data) ? response.data : []);
    } catch (error: any) {
      console.error("API Error:", error.response?.status);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (token) await fetchWorkers(token);
    else setRefreshing(false);
  }, [token]);

  useEffect(() => {
    const init = async () => {
      const savedToken = await AsyncStorage.getItem("token-fixzo");
      setToken(savedToken);
      if (savedToken) fetchWorkers(savedToken);
    };
    init();
  }, []);

  const filteredWorkers = workers.filter((w) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      w.name?.toLowerCase().includes(searchLower) ||
      w.worker_profile?.full_name?.toLowerCase().includes(searchLower) ||
      w.phone_number?.includes(searchLower)
    );
  });

  const getInitials = (name: string) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2)
      : "W";
  };

  const renderWorkerItem = ({ item }: { item: Worker }) => {
    const registrationDate = new Date(item.created_at).toLocaleDateString(
      "en-GB",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      },
    );

    return (
      <Pressable style={styles.card} android_ripple={{ color: "#f1f5f9" }}>
        {/* Letter Avatar instead of Image */}
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>
            {getInitials(item.worker_profile?.full_name || item.name)}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.row}>
            <Text style={styles.name} numberOfLines={1}>
              {item.worker_profile?.full_name || item.name}
            </Text>
            <View style={styles.idBadge}>
              <Text style={styles.idText}>#{item.id}</Text>
            </View>
          </View>

          {/* New Data: Phone and Guardian */}
          <View style={styles.metaRow}>
            <Feather name="phone" size={12} color="#64748b" />
            <Text style={styles.metaText}>{item.phone_number}</Text>
            <View style={styles.dot} />
            <Feather name="user" size={12} color="#64748b" />
            <Text style={styles.metaText}>
              {item.worker_profile?.guardian_name} (
              {item.worker_profile?.guardian_relation})
            </Text>
          </View>

          <View style={styles.metaRow}>
            <MaterialCommunityIcons name="tools" size={14} color="#6366f1" />
            <Text
              style={[styles.metaText, { color: "#4f46e5", fontWeight: "600" }]}
            >
              {item.worker_profile?.work_description || "Expert"}
            </Text>
          </View>

          <View style={styles.footerRow}>
            <View style={styles.metaRow}>
              <Ionicons name="location-sharp" size={13} color="#f43f5e" />
              <Text style={styles.metaText}>
                {item.worker_profile?.district?.name || "Local"}
              </Text>
            </View>
            <Text style={styles.dateText}>Reg: {registrationDate}</Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Workforce Management</Text>
          <Text style={styles.title}>Service Experts</Text>
        </View>
        <Pressable
          style={styles.addBtn}
          onPress={async () => {
            const storedUser = await AsyncStorage.getItem("user-fixzo");

            let agent_unique_id = "";

            if (storedUser) {
              const user = JSON.parse(storedUser);

              if (user?.role?.name === "agent") {
                agent_unique_id = user.agent_unique_id;
              }
            }

            router.push({
              pathname: "/register-worker",
              params: {
                token,
                agent_unique_id,
              },
            });
          }}
        >
          <View style={styles.addBtnInner}>
            <Feather name="plus" size={18} color="#fff" />
            <Text style={styles.addBtnText}>Add</Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#94a3b8" />
          <TextInput
            placeholder="Search name, phone or skill..."
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={filteredWorkers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderWorkerItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#2563eb"]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather name="users" size={48} color="#cbd5e1" />
              <Text style={styles.emptyText}>No workers found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 28,
  },
  greeting: {
    fontSize: 11,
    color: "#6366f1",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  addBtn: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  addBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 4,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  searchSection: {
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: "#1e293b",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#64748b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#e0e7ff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#c7d2fe",
  },
  avatarText: {
    color: "#4338ca",
    fontWeight: "800",
    fontSize: 18,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    flex: 1,
  },
  idBadge: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  idText: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#64748b",
    marginLeft: 5,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#cbd5e1",
    marginHorizontal: 8,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  dateText: {
    fontSize: 10,
    color: "#94a3b8",
    fontWeight: "600",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
  },
  emptyState: {
    marginTop: 100,
    alignItems: "center",
  },
  emptyText: {
    marginTop: 10,
    fontSize: 15,
    color: "#94a3b8",
  },
});
