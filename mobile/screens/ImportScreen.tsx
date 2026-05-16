import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ImportScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recipe, setRecipe] = useState<any>(null);

  const styles = makeStyles(theme);

  useFocusEffect(
    useCallback(() => {
      // Reset everything every time screen is opened
      setUrl("");
      setRecipe(null);
      setError("");
      setSavedId(null);
      setLoading(false);
      setSaving(false);
    }, []),
  );

  async function handleImport() {
    Keyboard.dismiss();
    if (!url) {
      setError("Please enter a URL");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/parse-recipe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const json = await response.json();
      if (json.error) {
        setError(json.error);
      } else {
        setRecipe(json.data);
      }
    } catch (e) {
      setError("Could not reach the server — is Docker running?");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!recipe) return;
    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/save-recipe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { ...recipe, source_url: url } }),
      });

      const json = await response.json();

      if (json.error) {
        setError(json.error);
      } else {
        setSavedId(json.id);
        setTimeout(() => navigation.navigate("Book"), 1000); // brief delay so user sees
      }
    } catch (e) {
      setError("Could not save recipe");
    } finally {
      setSaving(false);
    }
  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.heading}>Import a Recipe</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Book")}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* URL Input */}
        <TextInput
          style={styles.input}
          placeholder="https://www.bbcgoodfood.com/..."
          placeholderTextColor={theme.subtext}
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          keyboardType="url"
          keyboardAppearance={isDark ? "dark" : "light"}
        />

        {/* Import Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleImport}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Import Recipe</Text>
          )}
        </TouchableOpacity>

        {/* Error */}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Recipe Result */}
        {recipe && (
          <View style={styles.card}>
            {/* Recipe Image */}
            {recipe.image && (
              <Image source={{ uri: recipe.image }} style={styles.image} />
            )}

            {/* Title */}
            <Text style={styles.title}>{recipe.title}</Text>

            {/* Servings */}
            {recipe.servings && (
              <Text style={styles.meta}>Serves: {recipe.servings}</Text>
            )}

            {/* Ingredients */}
            <Text style={styles.sectionHeader}>Ingredients</Text>
            {recipe.ingredients.map((ing: string, i: number) => (
              <Text key={i} style={styles.listItem}>
                • {ing}
              </Text>
            ))}

            {/* Steps */}
            <Text style={styles.sectionHeader}>Steps</Text>
            {recipe.steps.map((step: string, i: number) => (
              <Text key={i} style={styles.listItem}>
                {i + 1}. {step}
              </Text>
            ))}

            {/* Save Button */}
            {!savedId ? (
              <TouchableOpacity
                style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Recipe</Text>
                )}
              </TouchableOpacity>
            ) : (
              <View style={styles.savedBadge}>
                <Text style={styles.savedText}>✓ Saved to your book</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function makeStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: theme.background,
      padding: 24,
    },
    heading: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 8,
      marginTop: 48,
    },
    subtext: {
      fontSize: 15,
      color: theme.subtext,
      marginBottom: 24,
    },
    input: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      padding: 16,
      fontSize: 15,
      color: theme.text,
      marginBottom: 16,
    },
    button: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      marginBottom: 16,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    error: {
      color: theme.error,
      fontSize: 14,
      marginBottom: 16,
      textAlign: "center",
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 20,
      marginTop: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
    image: {
      width: "100%",
      height: 200,
      borderRadius: 12,
      marginBottom: 16,
    },
    title: {
      fontSize: 22,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 4,
    },
    meta: {
      fontSize: 14,
      color: theme.subtext,
      marginBottom: 16,
    },
    sectionHeader: {
      fontSize: 17,
      fontWeight: "600",
      color: theme.text,
      marginTop: 16,
      marginBottom: 8,
    },
    listItem: {
      fontSize: 14,
      color: theme.text,
      lineHeight: 22,
      marginBottom: 4,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 8,
      marginTop: 48,
    },
    closeButton: {
      fontSize: 20,
      color: theme.subtext,
      padding: 4,
    },
    saveButton: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      padding: 14,
      alignItems: "center",
      marginTop: 16,
    },
    saveButtonDisabled: {
      opacity: 0.6,
    },
    saveButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    savedBadge: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 14,
      alignItems: "center",
      marginTop: 16,
      borderWidth: 1,
      borderColor: theme.primary,
    },
    savedText: {
      color: theme.primary,
      fontSize: 15,
      fontWeight: "600",
    },
  });
}
