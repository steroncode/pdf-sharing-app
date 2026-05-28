import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useRole } from "@/lib/role-context";
import { usePDF } from "@/lib/pdf-context";
import { useEffect } from "react";
import * as Haptics from "expo-haptics";

export default function RoleSelectionScreen() {
  const router = useRouter();
  const { setRole } = useRole();
  const { loadPDFs } = usePDF();

  useEffect(() => {
    // Load PDFs when app starts
    loadPDFs();
  }, [loadPDFs]);

  const handleRoleSelection = async (selectedRole: "teacher" | "student") => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await setRole(selectedRole);
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Failed to set role:", error);
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-center gap-8">
          {/* Header */}
          <View className="items-center gap-3 mb-8">
            <Text className="text-4xl font-bold text-foreground">PDF Share Connect</Text>
            <Text className="text-base text-muted text-center">
              Choose your role to get started
            </Text>
          </View>

          {/* Teacher Card */}
          <TouchableOpacity
            onPress={() => handleRoleSelection("teacher")}
            activeOpacity={0.8}
            className="bg-surface rounded-2xl p-8 border border-border shadow-sm"
          >
            <View className="items-center gap-4">
              <View className="w-16 h-16 bg-primary rounded-full items-center justify-center">
                <Text className="text-3xl">📚</Text>
              </View>
              <Text className="text-2xl font-bold text-foreground">I'm a Teacher</Text>
              <Text className="text-sm text-muted text-center leading-relaxed">
                Share PDF learning materials with your students. Upload links and manage your resources.
              </Text>
              <View className="mt-4 bg-primary bg-opacity-10 rounded-lg px-4 py-2">
                <Text className="text-sm font-semibold text-primary">Post PDFs • Track Downloads</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Student Card */}
          <TouchableOpacity
            onPress={() => handleRoleSelection("student")}
            activeOpacity={0.8}
            className="bg-surface rounded-2xl p-8 border border-border shadow-sm"
          >
            <View className="items-center gap-4">
              <View className="w-16 h-16 bg-primary rounded-full items-center justify-center">
                <Text className="text-3xl">🎓</Text>
              </View>
              <Text className="text-2xl font-bold text-foreground">I'm a Student</Text>
              <Text className="text-sm text-muted text-center leading-relaxed">
                Browse and download PDF materials shared by your teachers. Access learning resources anytime.
              </Text>
              <View className="mt-4 bg-primary bg-opacity-10 rounded-lg px-4 py-2">
                <Text className="text-sm font-semibold text-primary">Browse • Download • Organize</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Footer Info */}
          <View className="items-center mt-8">
            <Text className="text-xs text-muted text-center">
              You can change your role anytime from the settings menu
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
