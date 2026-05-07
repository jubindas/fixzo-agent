import { Feather } from "@expo/vector-icons";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";


const EARNINGS = [
  {
    id: "1",
    worker: "Rahul Sharma",
    amount: 1200,
    date: "10 Apr",
    type: "Electrician",
  },
  { id: "2", worker: "Amit Das", amount: 850, date: "09 Apr", type: "Plumber" },
  {
    id: "3",
    worker: "Rakesh Singh",
    amount: 2100,
    date: "08 Apr",
    type: "Carpenter",
  },
  {
    id: "4",
    worker: "Suman Phukan",
    amount: 1500,
    date: "07 Apr",
    type: "Painter",
  },
];

export default function Wallet() {
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>My Wallet</Text>
        <Pressable style={styles.iconBtn}>
          <Feather name="bell" size={20} color="#1e293b" />
        </Pressable>
      </View>

      {/* BALANCE CARD */}
      <View style={styles.balanceCard}>
        <View>
          <Text style={styles.balanceLabel}>Total Earnings</Text>
          <Text style={styles.balanceAmount}>₹5,650.00</Text>
        </View>
        <View style={styles.statsCircle}>
          <Feather name="trending-up" size={24} color="#fff" />
        </View>
      </View>

      {/* QUICK ACTIONS */}
      <View style={styles.actionRow}>
        <View style={styles.actionItem}>
          <View style={[styles.actionIcon, { backgroundColor: "#eff6ff" }]}>
            <Feather name="download" size={20} color="#2563eb" />
          </View>
          <Text style={styles.actionText}>Withdraw</Text>
        </View>
        <View style={styles.actionItem}>
          <View style={[styles.actionIcon, { backgroundColor: "#f0fdf4" }]}>
            <Feather name="file-text" size={20} color="#16a34a" />
          </View>
          <Text style={styles.actionText}>Reports</Text>
        </View>
      </View>

      {/* TRANSACTION LIST */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Recent Settlements</Text>
        <Text style={styles.viewAll}>View All</Text>
      </View>

      <FlatList
        data={EARNINGS}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.transactionCard}>
            <View style={styles.workerAvatar}>
              <Text style={styles.avatarText}>{item.worker.charAt(0)}</Text>
            </View>

            <View style={styles.details}>
              <Text style={styles.workerName}>{item.worker}</Text>
              <Text style={styles.workerType}>
                {item.type} • {item.date}
              </Text>
            </View>

            <View style={styles.amountContainer}>
              <Text style={styles.amountText}>+₹{item.amount}</Text>
              <Text style={styles.statusText}>Completed</Text>
            </View>
          </View>
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
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
  },
  iconBtn: {
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  balanceCard: {
    backgroundColor: "#2563eb",
    padding: 24,
    borderRadius: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    // Shadow
    shadowColor: "#2563eb",
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  balanceLabel: {
    color: "#bfdbfe",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  balanceAmount: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "800",
  },
  statsCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 30,
  },
  actionItem: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1e293b",
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  viewAll: {
    color: "#2563eb",
    fontSize: 13,
    fontWeight: "600",
  },
  transactionCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  workerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2563eb",
  },
  details: {
    flex: 1,
    marginLeft: 14,
  },
  workerName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
  },
  workerType: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#16a34a",
  },
  statusText: {
    fontSize: 10,
    color: "#94a3b8",
    fontWeight: "600",
    textTransform: "uppercase",
  },
});
