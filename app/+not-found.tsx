import { Feather } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      {/* This ensures the header title is set if you're using a Stack */}
      <Stack.Screen options={{ title: "Oops!", headerShown: false }} />

      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Feather name="search" size={48} color="#94a3b8" />
        </View>

        <Text style={styles.title}>Page Not Found</Text>
        <Text style={styles.message}>
          The page you are looking for doesnot exist or has been moved.
        </Text>

        <Link href="/" asChild>
          <Pressable style={styles.button}>
            <Feather
              name="home"
              size={18}
              color="#fff"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Go to Home</Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f8fafc", // Matches your soft blue/slate background
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    // Premium shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#2563eb", // Your premium blue
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
