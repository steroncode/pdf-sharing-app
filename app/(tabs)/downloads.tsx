import { View, Text, TouchableOpacity, FlatList, RefreshControl } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useState } from "react";
import * as Haptics from "expo-haptics";

// Mock downloaded PDFs - in a real app, this would track actual downloads
const mockDownloads = [
  {
    id: "1",
    title: "Mathematics Basics",
    teacher: "Mr. Smith",
    downloadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    fileSize: "2.4 MB",
  },
  {
    id: "2",
    title: "Physics Chapter 3",
    teacher: "Ms. Johnson",
    downloadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    fileSize: "1.8 MB",
  },
];

export default function DownloadsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [downloads] = useState(mockDownloads);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setRefreshing(false);
  };

  const handleOpenFile = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // In a real app, this would open the downloaded file
  };

  const handleDeleteFile = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // In a real app, this would delete the downloaded file
  };

  return (
    <ScreenContainer className="p-4">
      <FlatList
        data={downloads}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <View className="mb-6">
            <Text className="text-3xl font-bold text-foreground mb-2">Downloads</Text>
            <Text className="text-sm text-muted mb-4">
              {downloads.length} {downloads.length === 1 ? "file" : "files"} downloaded
            </Text>
            {downloads.length === 0 && (
              <View className="bg-surface rounded-2xl p-8 items-center gap-4 border border-border">
                <Text className="text-4xl">📥</Text>
                <Text className="text-lg font-semibold text-foreground">No downloads yet</Text>
                <Text className="text-sm text-muted text-center">
                  Download PDFs from the Browse tab to see them here
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
                <Text className="text-sm text-muted mt-1">by {item.teacher}</Text>
                <View className="flex-row gap-4 mt-3">
                  <Text className="text-xs text-muted">
                    💾 {item.fileSize}
                  </Text>
                  <Text className="text-xs text-muted">
                    📅 {new Date(item.downloadedAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <View className="gap-2">
                <TouchableOpacity
                  onPress={() => handleOpenFile(item.id)}
                  className="bg-primary bg-opacity-10 rounded-lg p-2"
                >
                  <Text className="text-lg">👁️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteFile(item.id)}
                  className="bg-error bg-opacity-10 rounded-lg p-2"
                >
                  <Text className="text-lg">🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        scrollEnabled={false}
        ListFooterComponent={<View className="h-24" />}
      />
    </ScreenContainer>
  );
}
