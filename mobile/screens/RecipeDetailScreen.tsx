import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
const API_URL = process.env.EXPO_PUBLIC_API_URL;
export default function RecipeDetailScreen({ route, navigation }: any) {
  const { theme } = useTheme();
  const { recipe } = route.params;
  const styles = makeStyles(theme);
  // Normalize ingredients/instructions
  const ingredients: string[] = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
    : typeof recipe.ingredients === "string"
      ? recipe.ingredients.split("\n").filter(Boolean)
      : [];

  const instructions: string[] = Array.isArray(recipe.instructions)
    ? recipe.instructions
    : typeof recipe.instructions === "string"
      ? recipe.instructions.split("\n").filter(Boolean)
      : [];

  async function handleDelete() {
    Alert.alert("Delete Recipe", `Remove "${recipe.title}" from your book?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await fetch(`${API_URL}/recipes/${recipe.id}`, {
              method: "DELETE",
            });
            if (res.ok) {
              navigation.goBack(); // BookScreen will refetch on focus
            } else {
              Alert.alert("Error", "Could not delete recipe.");
            }
          } catch (e) {
            Alert.alert("Error", "Network error. Try again.");
          }
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      {/* Header row */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Image or placeholder */}
        {recipe.image_url ? (
          <Image source={{ uri: recipe.image_url }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderIcon}>🍽️</Text>
          </View>
        )}

        {/* Title */}
        <Text style={styles.title}>{recipe.title}</Text>

        {/* Source URL if present */}
        {recipe.source_url ? (
          <Text style={styles.source} numberOfLines={1}>
            {recipe.source_url}
          </Text>
        ) : null}

        {/* Ingredients */}
        {ingredients.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Ingredients</Text>
            {ingredients.map((line, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{line}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Instructions */}
        {instructions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Instructions</Text>
            {instructions.map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <Text style={styles.stepNumber}>{i + 1}</Text>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Fallback if nothing parsed */}
        {ingredients.length === 0 && instructions.length === 0 && (
          <Text style={styles.empty}>
            No details were parsed for this recipe.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

function makeStyles(theme: any) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingTop: 56,
      paddingBottom: 12,
    },
    backBtn: { padding: 8 },
    backText: { color: theme.primary, fontSize: 16 },
    deleteBtn: { padding: 8 },
    deleteText: { color: "#e74c3c", fontSize: 16 },
    scroll: { paddingHorizontal: 16, paddingBottom: 40 },
    image: { width: "100%", height: 220, borderRadius: 12, marginBottom: 16 },
    imagePlaceholder: {
      width: "100%",
      height: 160,
      borderRadius: 12,
      backgroundColor: theme.card,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    placeholderIcon: { fontSize: 48 },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 6,
    },
    source: { fontSize: 12, color: theme.subtext, marginBottom: 16 },
    section: { marginTop: 24 },
    sectionHeading: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 12,
    },
    bulletRow: { flexDirection: "row", marginBottom: 8 },
    bullet: {
      color: theme.primary,
      fontSize: 16,
      marginRight: 8,
      marginTop: 1,
    },
    bulletText: { flex: 1, color: theme.text, fontSize: 15, lineHeight: 22 },
    stepRow: { flexDirection: "row", marginBottom: 12 },
    stepNumber: {
      color: theme.primary,
      fontWeight: "700",
      fontSize: 15,
      marginRight: 10,
      minWidth: 20,
    },
    stepText: { flex: 1, color: theme.text, fontSize: 15, lineHeight: 22 },
    empty: {
      color: theme.subtext,
      marginTop: 40,
      textAlign: "center",
      fontSize: 15,
    },
  });
}
