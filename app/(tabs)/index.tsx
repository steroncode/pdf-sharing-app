import { ScrollView, Text, View, TouchableOpacity, FlatList, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useRole } from "@/lib/role-context";
import { usePDF } from "@/lib/pdf-context";
import { useState, useEffect } from "react";
import * as Haptics from "expo-haptics";

export default function HomeScreen() {
  const router = useRouter();
  const { role } = useRole();
  const { pdfs, deletePDF } = usePDF();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    setRefreshing(false);
  };

  const handleAddPDF = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/upload-pdf");
  };

  const handleDeletePDF = async (id: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await deletePDF(id);
  };

  const teacherPDFs = pdfs.filter((pdf) => pdf.teacher === "You");
  const allPDFs = pdfs;

  if (role === "teacher") {
    return (
      <ScreenContainer className="p-4">
        <FlatList
          data={teacherPDFs}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListHeaderComponent={
            <View className="mb-6">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-3xl font-bold text-foreground">My PDFs</Text>
              </View>
              {teacherPDFs.length === 0 && (
                <View className="bg-surface rounded-2xl p-8 items-center gap-4 border border-border">
                  <Text className="text-4xl">📄</Text>
                  <Text className="text-lg font-semibold text-foreground">No PDFs yet</Text>
                  <Text className="text-sm text-muted text-center">
                    Tap the button below to share your first PDF with students
                  </Text>
                </View>
              )}
            </View>
          }
          renderItem={({ item }) => (
            <View className="bg-surface rounded-2xl p-4 mb-4 border border-border">
              <View className="flex-row justify-between items-start gap-3">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-foreground" numberOfLines={2}>
                    {item.title}
                  </Text>
                  {item.description && (
                    <Text className="text-sm text-muted mt-1 leading-relaxed" numberOfLines={2}>
                      {item.description}
                    </Text>
                  )}
                  <View className="flex-row gap-4 mt-3">
                    <Text className="text-xs text-muted">
                      📥 {item.downloadCount} downloads
                    </Text>
                    <Text className="text-xs text-muted">
                      📅 {new Date(item.uploadedAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeletePDF(item.id)}
                  className="bg-error bg-opacity-10 rounded-lg p-2"
                >
                  <Text className="text-lg">🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          scrollEnabled={false}
          ListFooterComponent={<View className="h-24" />}
        />

        {/* Floating Action Button */}
        <TouchableOpacity
          onPress={handleAddPDF}
          className="absolute bottom-24 right-6 bg-primary rounded-full w-16 h-16 items-center justify-center shadow-lg"
        >
          <Text className="text-3xl">➕</Text>
        </TouchableOpacity>
      </ScreenContainer>
    );
  }

  // Student View
  return (
    <ScreenContainer className="p-4">
      <FlatList
        data={allPDFs}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <View className="mb-6">
            <Text className="text-3xl font-bold text-foreground mb-2">Browse PDFs</Text>
            <Text className="text-sm text-muted mb-4">
              {allPDFs.length} {allPDFs.length === 1 ? "PDF" : "PDFs"} available
            </Text>
            {allPDFs.length === 0 && (
              <View className="bg-surface rounded-2xl p-8 items-center gap-4 border border-border">
                <Text className="text-4xl">📚</Text>
                <Text className="text-lg font-semibold text-foreground">No PDFs available</Text>
                <Text className="text-sm text-muted text-center">
                  Your teachers haven't shared any PDFs yet. Check back soon!
                </Text>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push({
                pathname: "/pdf-detail",
                params: { pdfId: item.id },
              });
            }}
            className="bg-surface rounded-2xl p-4 mb-4 border border-border"
            activeOpacity={0.7}
          >
            <View className="gap-2">
              <Text className="text-lg font-semibold text-foreground" numberOfLines={2}>
                {item.title}
              </Text>
              <Text className="text-sm text-muted" numberOfLines={1}>
                by {item.teacher}
              </Text>
              {item.description && (
                <Text className="text-sm text-muted mt-1 leading-relaxed" numberOfLines={2}>
                  {item.description}
                </Text>
              )}
              <View className="flex-row gap-4 mt-3">
                <Text className="text-xs text-muted">📥 {item.downloadCount}</Text>
                <Text className="text-xs text-muted">
                  📅 {new Date(item.uploadedAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        scrollEnabled={false}
        ListFooterComponent={<View className="h-24" />}
      />
    </ScreenContainer>
  );
}
