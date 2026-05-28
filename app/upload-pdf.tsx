import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { usePDF } from "@/lib/pdf-context";
import { useState } from "react";
import * as Haptics from "expo-haptics";

export default function UploadPDFScreen() {
  const router = useRouter();
  const { addPDF } = usePDF();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateForm = () => {
    if (!title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!pdfUrl.trim()) {
      setError("PDF link is required");
      return false;
    }
    // Basic URL validation
    try {
      new URL(pdfUrl);
    } catch {
      setError("Please enter a valid URL");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError("");
    if (!validateForm()) return;

    try {
      setLoading(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      await addPDF({
        title: title.trim(),
        description: description.trim(),
        pdfUrl: pdfUrl.trim(),
        teacher: "You",
        category: category.trim() || undefined,
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (err) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError("Failed to upload PDF. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* Header */}
          <View className="gap-2 mb-4">
            <Text className="text-3xl font-bold text-foreground">Share PDF</Text>
            <Text className="text-sm text-muted">Add a new PDF for your students</Text>
          </View>

          {/* Error Message */}
          {error && (
            <View className="bg-error bg-opacity-10 rounded-lg p-4 border border-error">
              <Text className="text-sm text-error">{error}</Text>
            </View>
          )}

          {/* Title Input */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Title *</Text>
            <TextInput
              placeholder="Enter PDF title"
              placeholderTextColor="#9BA1A6"
              value={title}
              onChangeText={setTitle}
              editable={!loading}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
            />
          </View>

          {/* Description Input */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Description</Text>
            <TextInput
              placeholder="Enter PDF description (optional)"
              placeholderTextColor="#9BA1A6"
              value={description}
              onChangeText={setDescription}
              editable={!loading}
              multiline
              numberOfLines={4}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              style={{ textAlignVertical: "top" }}
            />
          </View>

          {/* PDF Link Input */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">PDF Link *</Text>
            <TextInput
              placeholder="https://example.com/document.pdf"
              placeholderTextColor="#9BA1A6"
              value={pdfUrl}
              onChangeText={setPdfUrl}
              editable={!loading}
              autoCapitalize="none"
              keyboardType="url"
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
            />
            <Text className="text-xs text-muted">
              Paste a direct link to a PDF file (must end with .pdf or be a direct PDF URL)
            </Text>
          </View>

          {/* Category Input */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Category</Text>
            <TextInput
              placeholder="e.g., Mathematics, Science, History"
              placeholderTextColor="#9BA1A6"
              value={category}
              onChangeText={setCategory}
              editable={!loading}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className="bg-primary rounded-lg py-4 items-center mt-4"
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-lg font-semibold text-background">Upload PDF</Text>
            )}
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            disabled={loading}
            className="border border-border rounded-lg py-4 items-center"
            activeOpacity={0.8}
          >
            <Text className="text-lg font-semibold text-foreground">Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
