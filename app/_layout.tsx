import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#f8fafc" },
        headerTintColor: "#111827",
        headerTitleStyle: { fontWeight: "700" },
        contentStyle: { backgroundColor: "#f8fafc" }
      }}
    >
      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="worker"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="register-worker"
        options={{ title: "Register Worker" }}
      />
    </Stack>
  );
}
