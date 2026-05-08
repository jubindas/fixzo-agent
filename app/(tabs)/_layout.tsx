import { Feather } from "@expo/vector-icons";

import { Tabs } from "expo-router";

import React from "react";

import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2563eb", // Premium blue
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          borderTopWidth: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 8,
          paddingTop: 8,
          elevation: 10,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 10,
          backgroundColor: "#fff",
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginTop: 2,
        },
      }}
    >
      {/* HOME / WORKERS SCREEN */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Workers",
          tabBarIcon: ({ color, focused }) => (
            <Feather name="users" size={focused ? 24 : 22} color={color} />
          ),
        }}
      />

      {/* WALLET SCREEN */}
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          tabBarIcon: ({ color, focused }) => (
            <Feather
              name="credit-card"
              size={focused ? 24 : 22}
              color={color}
            />
          ),
        }}
      />

    <Tabs.Screen
  name="user"
  options={{
    title: "Account",
    tabBarIcon: ({ color, focused }) => (
      <Feather
        name="user"
        size={focused ? 24 : 22}
        color={color}
      />
    ),
  }}
/>
    </Tabs>
  );
}
