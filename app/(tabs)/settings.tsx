import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useRole } from "@/lib/role-context";
import * as Haptics from "expo-haptics";

export default function SettingsScreen() {
  const router = useRouter();
  const { setRole } = useRole();

  const handleChangeRole = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await setRole(null);
      router.replace("/role-selection");
    } catch (error) {
      console.error("Failed to change role:", error);
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* Header */}
          <View className="gap-2 mb-4">
            <Text className="text-3xl font-bold text-foreground">Settings</Text>
            <Text className="text-sm text-muted">Manage your account and preferences</Text>
          </View>

          {/* Account Section */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">Account</Text>

            <View className="bg-surface rounded-2xl p-4 border border-border gap-4">
              <View>
                <Text className="text-sm text-muted mb-1">Role</Text>
                <Text className="text-base font-semibold text-foreground">Teacher</Text>
              </View>
              <View className="h-px bg-border" />
              <View>
                <Text className="text-sm text-muted mb-1">Status</Text>
                <Text className="text-base font-semibold text-success">Active</Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleChangeRole}
              className="border border-border rounded-lg py-3 px-4 items-center"
              activeOpacity={0.8}
            >
              <Text className="text-base font-semibold text-foreground">Switch Role</Text>
            </TouchableOpacity>
          </View>

          {/* About Section */}
          <View className="gap-4 mt-4">
            <Text className="text-lg font-semibold text-foreground">About</Text>

            <View className="bg-surface rounded-2xl p-4 border border-border gap-4">
              <View>
                <Text className="text-sm text-muted mb-1">App Name</Text>
                <Text className="text-base font-semibold text-foreground">PDF Share Connect</Text>
              </View>
              <View className="h-px bg-border" />
              <View>
                <Text className="text-sm text-muted mb-1">Version</Text>
                <Text className="text-base font-semibold text-foreground">1.0.0</Text>
              </View>
            </View>
          </View>

          {/* Info Box */}
          <View className="bg-primary bg-opacity-10 rounded-lg p-4 mt-4">
            <Text className="text-xs text-primary text-center leading-relaxed">
              PDF Share Connect helps teachers and students collaborate through shared learning materials. All data is stored locally on your device.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
