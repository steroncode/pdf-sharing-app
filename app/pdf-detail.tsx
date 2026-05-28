import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Linking } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { usePDF } from "@/lib/pdf-context";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";

export default function PDFDetailScreen() {
  const router = useRouter();
  const { pdfId } = useLocalSearchParams<{ pdfId: string }>();
  const { pdfs, incrementDownloadCount } = usePDF();
  const [downloading, setDownloading] = useState(false);

  const pdf = pdfs.find((p) => p.id === pdfId);

  if (!pdf) {
    return (
      <ScreenContainer className="p-6 justify-center items-center">
        <Text className="text-lg text-muted">PDF not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 bg-primary rounded-lg px-6 py-3"
        >
          <Text className="text-foreground font-semibold">Go Back</Text>
        </TouchableOpacity>
      </ScreenContainer>
    );
  }

  const handleOpenPDF = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setDownloading(true);

      // Try to open in web browser first
      const result = await WebBrowser.openBrowserAsync(pdf.pdfUrl);

      if (result.type === "opened") {
        // Increment download count when PDF is opened
        await incrementDownloadCount(pdf.id);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error("Failed to open PDF:", error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      // Fallback: try to open with Linking
      try {
        await Linking.openURL(pdf.pdfUrl);
        await incrementDownloadCount(pdf.id);
      } catch (linkError) {
        console.error("Failed to open PDF with Linking:", linkError);
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      // Copy to clipboard (would need to import from expo-clipboard)
      // For now, just show a message
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* Header */}
          <TouchableOpacity onPress={() => router.back()} className="mb-2">
            <Text className="text-lg text-primary">← Back</Text>
          </TouchableOpacity>

          {/* PDF Icon */}
          <View className="items-center py-6">
            <View className="w-24 h-24 bg-primary bg-opacity-10 rounded-2xl items-center justify-center">
              <Text className="text-5xl">📄</Text>
            </View>
          </View>

          {/* Title */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">{pdf.title}</Text>
            <Text className="text-sm text-muted">by {pdf.teacher}</Text>
          </View>

          {/* Metadata */}
          <View className="bg-surface rounded-lg p-4 border border-border gap-3">
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">Uploaded</Text>
              <Text className="text-sm font-semibold text-foreground">
                {new Date(pdf.uploadedAt).toLocaleDateString()}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">Downloads</Text>
              <Text className="text-sm font-semibold text-foreground">{pdf.downloadCount}</Text>
            </View>
            {pdf.category && (
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted">Category</Text>
                <Text className="text-sm font-semibold text-foreground">{pdf.category}</Text>
              </View>
            )}
          </View>

          {/* Description */}
          {pdf.description && (
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground">Description</Text>
              <Text className="text-sm text-muted leading-relaxed">{pdf.description}</Text>
            </View>
          )}

          {/* Download Button */}
          <TouchableOpacity
            onPress={handleOpenPDF}
            disabled={downloading}
            className="bg-primary rounded-lg py-4 items-center mt-4"
            activeOpacity={0.8}
          >
            {downloading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <View className="flex-row items-center gap-2">
                <Text className="text-lg">📥</Text>
                <Text className="text-lg font-semibold text-background">Download PDF</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Copy Link Button */}
          <TouchableOpacity
            onPress={handleCopyLink}
            disabled={downloading}
            className="border border-border rounded-lg py-4 items-center"
            activeOpacity={0.8}
          >
            <View className="flex-row items-center gap-2">
              <Text className="text-lg">🔗</Text>
              <Text className="text-lg font-semibold text-foreground">Copy Link</Text>
            </View>
          </TouchableOpacity>

          {/* Info Message */}
          <View className="bg-primary bg-opacity-10 rounded-lg p-4">
            <Text className="text-xs text-primary text-center">
              Tap "Download PDF" to open or download the file. Your download will be counted.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
