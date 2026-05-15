import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Collection = () => {
  const sources = [
    {
      id: "1",
      name: "Freelance Project",
      date: "May 14, 2026",
      amount: 4500.0,
      type: "Direct",
    },
    {
      id: "2",
      name: "Digital Product Sales",
      date: "May 12, 2026",
      amount: 890.5,
      type: "Stripe",
    },
    {
      id: "3",
      name: "Consultation Call",
      date: "May 10, 2026",
      amount: 250.0,
      type: "PayPal",
    },
    {
      id: "4",
      name: "Affiliate Commission",
      date: "May 08, 2026",
      amount: 120.0,
      type: "Internal",
    },
  ];

  const totalAmount = sources.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Summary Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerContent}>
            <Text style={styles.label}>Total Balance</Text>
            <Text style={styles.totalAmount}>
              ₹
              {totalAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </Text>
          </View>
        </View>

        {/* List Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Income Sources</Text>
          <TouchableOpacity activeOpacity={0.6}>
            <Text style={styles.viewAllText}>View Report</Text>
          </TouchableOpacity>
        </View>

        {sources.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.9}
            style={styles.sourceCard}
          >
            <View style={styles.iconBox}>
              <Text style={styles.iconText}>₹</Text>
            </View>
            <View style={styles.sourceInfo}>
              <Text style={styles.sourceName}>{item.name}</Text>
              <Text style={styles.sourceDetails}>
                {item.date} • {item.type}
              </Text>
            </View>
            <View style={styles.amountContainer}>
              <Text style={styles.amountText}>+${item.amount.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 10,
  },
  headerCard: {
    margin: 20,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    padding: 2, // Gradient-like border effect
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 8,
    marginTop: 50,
  },
  headerContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 28,
    alignItems: "center",
  },
  label: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 40,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -1,
  },
  growthBadge: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 16,
  },
  growthText: {
    color: "#059669",
    fontSize: 12,
    fontWeight: "700",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#1E293B",
  },
  viewAllText: {
    color: "#3B82F6",
    fontSize: 14,
    fontWeight: "700",
  },
  sourceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 14,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
  },
  iconBox: {
    width: 48,
    height: 48,
    backgroundColor: "#F0F7FF",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    color: "#3B82F6",
    fontSize: 22,
    fontWeight: "700",
  },
  sourceInfo: {
    flex: 1,
    marginLeft: 16,
  },
  sourceName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  sourceDetails: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "500",
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#10B981",
  },
});

export default Collection;
