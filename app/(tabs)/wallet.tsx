import { Feather } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Transaction {
  id: number;
  agent_id: number;
  amount: string;
  created_at: string;
  description: string;
  reference_id: number;
  type: "credit" | "debit";
}

interface WalletData {
  balance: string;
  transactions: Transaction[];
}

export default function Wallet() {
  const [walletData, setWalletData] = useState<WalletData>({
    balance: "0.00",
    transactions: [],
  });

  const [loading, setLoading] = useState<boolean>(true);

  const [requesting, setRequesting] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<"Online" | "Cash">("Cash");

  const [cashFilter, setCashFilter] = useState<"all" | "credit" | "debit">(
    "all",
  );

  const fetchWallet = useCallback(async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token-fixzo");

      const response = await axios.get(
        "https://api-fixzo-test.santirekha.com/api/agent/wallet",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setWalletData({
        balance: response?.data?.balance || "0.00",
        transactions: response?.data?.transactions || [],
      });
    } catch (error: any) {
      console.log("API ERROR:", error?.response?.data || error?.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleWithdrawalRequest = useCallback(async () => {
    try {
      setRequesting(true);
      const token = await AsyncStorage.getItem("token-fixzo");
      await axios.post(
        "https://api-fixzo-test.santirekha.com/api/agent/wallet/request-release",
        { amount: walletData.balance },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      Alert.alert("Success", "Withdrawal request submitted.");
      fetchWallet(); // Refresh to show new debit transaction
    } catch (error: any) {
      Alert.alert("Error", error?.response?.data?.message || "Request failed.");
    } finally {
      setRequesting(false);
    }
  }, [walletData.balance, fetchWallet]);

  const confirmRequest = () => {
    Alert.alert("Request Withdrawal", `Withdraw ₹${walletData.balance}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Confirm", onPress: handleWithdrawalRequest },
    ]);
  };

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  const filteredTransactions = useMemo(() => {
    if (activeTab === "Online") return []; // Empty for future API

    return walletData.transactions.filter((t) => {
      const isCashItem =
        t.description.toLowerCase().includes("(cash)") ||
        t.description.toLowerCase().includes("release request");
      if (!isCashItem) return false;
      if (cashFilter === "all") return true;
      return t.type === cashFilter;
    });
  }, [activeTab, cashFilter, walletData.transactions]);

  const getNameFromDesc = (desc: string) => {
    if (!desc) return "System";
    if (desc.toLowerCase().includes("release request"))
      return "Cash Release Request";
    const parts = desc.split(" - ");
    return parts.length > 1 ? parts[1] : desc;
  };

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const isCredit = item.type === "credit";
    const displayName = getNameFromDesc(item.description);

    return (
      <View style={styles.transactionCard}>
        <View
          style={[
            styles.typeIcon,
            { backgroundColor: isCredit ? "#f0fdf4" : "#fef2f2" },
          ]}
        >
          <Feather
            name={isCredit ? "arrow-down-left" : "arrow-up-right"}
            size={18}
            color={isCredit ? "#16a34a" : "#dc2626"}
          />
        </View>

        <View style={styles.details}>
          <Text style={styles.workerName} numberOfLines={1}>
            {displayName}
          </Text>
          <Text style={styles.workerType}>
            {new Date(item.created_at).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
            })}{" "}
            • {item.type.toUpperCase()}
          </Text>
        </View>

        <View style={styles.amountContainer}>
          <Text
            style={[
              styles.amountText,
              { color: isCredit ? "#16a34a" : "#0f172a" },
            ]}
          >
            {isCredit ? "+" : "-"}₹{parseFloat(item.amount).toFixed(0)}
          </Text>
          <Text style={styles.statusText}>Settled</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Earnings Overview</Text>
          <Text style={styles.title}>My Wallet</Text>
        </View>
        <Pressable style={styles.iconBtn} onPress={fetchWallet}>
          <Feather name="refresh-cw" size={18} color="#64748b" />
        </Pressable>
      </View>

      <View style={styles.balanceCard}>
        <View>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceAmount}>₹{walletData.balance}</Text>
        </View>
        <Pressable
          style={styles.requestBtn}
          onPress={confirmRequest}
          disabled={requesting || parseFloat(walletData.balance) <= 0}
        >
          {requesting ? (
            <ActivityIndicator size="small" color="#0f172a" />
          ) : (
            <Text style={styles.requestBtnText}>Request</Text>
          )}
        </Pressable>
      </View>

      <View style={styles.tabContainer}>
        {["Online", "Cash"].map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      {activeTab === "Cash" && (
        <View style={styles.subTabRow}>
          {["all", "credit", "debit"].map((filter) => (
            <Pressable
              key={filter}
              onPress={() => setCashFilter(filter as any)}
              style={[
                styles.subTab,
                cashFilter === filter && styles.activeSubTab,
              ]}
            >
              <Text
                style={[
                  styles.subTabText,
                  cashFilter === filter && styles.activeSubTabText,
                ]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#2563eb"
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Feather name="info" size={40} color="#cbd5e1" />
              <Text style={styles.emptyTitle}>
                {activeTab === "Online"
                  ? "Online History Pending"
                  : `No ${cashFilter} activity`}
              </Text>
            </View>
          }
          renderItem={renderTransaction}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fcfcfd", paddingHorizontal: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 11,
    color: "#94a3b8",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: { fontSize: 28, fontWeight: "800", color: "#0f172a" },
  iconBtn: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },

  balanceCard: {
    backgroundColor: "#0f172a",
    padding: 24,
    borderRadius: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  balanceLabel: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  balanceAmount: { color: "#fff", fontSize: 32, fontWeight: "800" },
  requestBtn: {
    backgroundColor: "#e2ff5d",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  requestBtnText: { color: "#0f172a", fontWeight: "700", fontSize: 14 },

  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    padding: 5,
    borderRadius: 16,
    marginBottom: 16,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 12 },
  activeTab: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  tabText: { fontSize: 14, fontWeight: "600", color: "#94a3b8" },
  activeTabText: { color: "#0f172a" },

  subTabRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  subTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  activeSubTab: { backgroundColor: "#0f172a", borderColor: "#0f172a" },
  subTabText: { fontSize: 12, fontWeight: "600", color: "#64748b" },
  activeSubTabText: { color: "#fff" },

  transactionCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  typeIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  details: { flex: 1, marginLeft: 12 },
  workerName: { fontSize: 15, fontWeight: "700", color: "#1e293b" },
  workerType: { fontSize: 12, color: "#94a3b8", marginTop: 2 },
  amountContainer: { alignItems: "flex-end" },
  amountText: { fontSize: 16, fontWeight: "800" },
  statusText: {
    fontSize: 10,
    color: "#cbd5e1",
    fontWeight: "700",
    textTransform: "uppercase",
    marginTop: 2,
  },
  emptyContainer: { alignItems: "center", marginTop: 40 },
  emptyTitle: { marginTop: 10, color: "#94a3b8", fontWeight: "600" },
});
