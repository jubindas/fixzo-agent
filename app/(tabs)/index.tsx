import AsyncStorage from "@react-native-async-storage/async-storage";

import { useRouter } from "expo-router";

import React, { useEffect, useState } from "react";

import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { ROOT_URL } from "@/url";

import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import axios from "axios";

type Worker = {
  id: string;
  name: string;
  skill: string;
  location: string;
  image: string;
};

const WORKERS: Worker[] = [
  {
    id: "1",
    name: "Rahul Sharma",
    skill: "Electrician",
    location: "Guwahati",
    image: "https://i.pravatar.cc/150?u=1",
  },
  {
    id: "2",
    name: "Amit Das",
    skill: "Plumber",
    location: "Jorhat",
    image: "https://i.pravatar.cc/150?u=2",
  },
  {
    id: "3",
    name: "Rakesh Singh",
    skill: "Carpenter",
    location: "Dibrugarh",
    image: "https://i.pravatar.cc/150?u=3",
  },
  {
    id: "4",
    name: "Suman Phukan",
    skill: "Painter",
    location: "Tezpur",
    image: "https://i.pravatar.cc/150?u=4",
  },
];

export default function Index() {

  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredWorkers = WORKERS.filter(
    (worker) =>
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.skill.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getToken = async () => {
      const savedToken = await AsyncStorage.getItem("token-fixzo");
      setToken(savedToken);

      console.log("My token is:", savedToken);
    };

    getToken();
  }, []);

  console.log("the token is", token);

  useEffect(() => {
    if (!token) return;

    const getAllWorkers = async () => {
      try {
        const response = await axios.get(`${ROOT_URL}/workers`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        console.log(response.data);
      } catch (error: any) {
        console.log("API Error:", error.response?.status, error.response?.data);
      }
    };

    getAllWorkers();
  }, [token]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Manage</Text>
          <Text style={styles.title}>Service Experts</Text>
        </View>
        <Pressable
          style={styles.addBtn}
          onPress={() => router.push("/register-worker")}
        >
          <Feather name="plus" size={18} color="#fff" />
          <Text style={styles.addBtnText}>Add</Text>
        </Pressable>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#94a3b8" />
          <TextInput
            placeholder="Search by name or skill..."
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <Pressable style={styles.filterBtn}>
          <Ionicons name="filter-outline" size={20} color="#2563eb" />
        </Pressable>
      </View>

      <View style={styles.chipContainer}>
        {["All", "Electrician", "Plumber", "Carpenter"].map((chip, index) => (
          <View
            key={chip}
            style={[styles.chip, index === 0 && styles.activeChip]}
          >
            <Text
              style={[styles.chipText, index === 0 && styles.activeChipText]}
            >
              {chip}
            </Text>
          </View>
        ))}
      </View>

      <FlatList
        data={filteredWorkers}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <Pressable style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.avatar} />

            <View style={styles.infoContainer}>
              <View style={styles.row}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Available</Text>
                </View>
              </View>

              <View style={styles.metaRow}>
                <MaterialCommunityIcons
                  name="briefcase-outline"
                  size={14}
                  color="#64748b"
                />
                <Text style={styles.metaText}>{item.skill}</Text>
                <View style={styles.dot} />
                <Ionicons name="location-outline" size={14} color="#64748b" />
                <Text style={styles.metaText}>{item.location}</Text>
              </View>
            </View>

            <Feather name="chevron-right" size={20} color="#cbd5e1" />
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
  },
  addBtn: {
    backgroundColor: "#2563eb",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 4,
    marginTop: 10,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  searchSection: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#1e293b",
  },
  filterBtn: {
    width: 50,
    height: 50,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  chipContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  activeChip: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  chipText: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "600",
  },
  activeChipText: {
    color: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 20,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: "#f1f5f9",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
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
  },
  statusBadge: {
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    color: "#16a34a",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: "#64748b",
    marginLeft: 2,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#cbd5e1",
    marginHorizontal: 6,
  },
});
