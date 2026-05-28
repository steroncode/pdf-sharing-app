import { Tabs, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect } from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Platform } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { useRole } from "@/lib/role-context";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { role, isLoading } = useRole();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 56 + bottomPadding;

  // Redirect to role selection if no role is set
  useEffect(() => {
    if (!isLoading && !role) {
      router.replace("/role-selection");
    }
  }, [role, isLoading, router]);

  if (isLoading) {
    return null; // Loading state
  }

  if (!role) {
    return null; // Will redirect via useEffect
  }

  const homeTitle = role === "teacher" ? "My PDFs" : "Browse";
  const secondTabTitle = role === "teacher" ? "Settings" : "Downloads";
  const secondTabName = role === "teacher" ? "settings" : "downloads";
  const secondTabIcon = role === "teacher" ? "gear" : "arrow.down.circle.fill";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: homeTitle,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name={secondTabName}
        options={{
          title: secondTabTitle,
          tabBarIcon: ({ color }) => <IconSymbol size={28} name={secondTabIcon as any} color={color} />,
        }}
      />
    </Tabs>
  );
}
