import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

const DUMMY_RECIPES = [
  {
    id: "1",
    title: "Classic Pancakes",
    image:
      "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/recipe-image-legacy-id-881465_10-7cc4719.jpg",
  },
  {
    id: "2",
    title: "Tandoori Chicken",
    image: null,
  },
  {
    id: "3",
    title: "Blueberry Muffins",
    image: null,
  },
];

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function BookScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const styles = makeStyles(theme);

  useFocusEffect(
    useCallback(() => {
      fetchRecipes();
    }, []),
  );

  async function fetchRecipes() {
    console.log("API_URL:", API_URL); // add this
    console.log("fetching recipes..."); // add this
    try {
      const response = await fetch(`${API_URL}/recipes`);
      const json = await response.json();
      console.log("recipes:", json); // add this
      setRecipes(json);
    } catch (e) {
      console.error("Could not load recipes", e);
    } finally {
      setLoading(false);
    }
  }

  function renderRecipeCard({ item }: any) {
    if (item.id === "add") {
      return (
        <TouchableOpacity
          style={[styles.card, styles.addCard]}
          onPress={() => navigation.navigate("import")}
        >
          <Text style={styles.addIcon}>+</Text>
          <Text style={styles.addText}>Import Rercipe</Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity style={styles.card}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.cardImage} />
        ) : (
          <View style={styles.cardImagePlaceholder}>
            <Text style={styles.placeholderIcon}>🍽️</Text>
          </View>
        )}
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.heading}>My Recipes</Text>

      {/* Search bar — tapping navigates to search screen */}
      <TouchableOpacity
        style={styles.searchBar}
        onPress={() => navigation.navigate("Search")}
        activeOpacity={0.7}
      >
        <Text style={styles.searchIcon}>🔍</Text>
        <Text style={styles.searchPlaceholder}>Search recipes...</Text>
      </TouchableOpacity>

      {/* Recipe grid */}
      <FlatList
        // data={[...DUMMY_RECIPES, { id: "add" }]}
        data={recipes}
        renderItem={renderRecipeCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.grid}
      />

      {/* FAB — must be outside FlatList */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("Import")}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

function makeStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 16,
      paddingTop: 48,
    },
    heading: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 16,
    },
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      padding: 12,
      marginBottom: 20,
      gap: 8,
    },
    searchIcon: {
      fontSize: 16,
    },
    searchPlaceholder: {
      fontSize: 15,
      color: theme.subtext,
    },
    grid: {
      paddingBottom: 24,
    },
    row: {
      gap: 8,
      marginBottom: 12,
    },
    card: {
      width: "48%",
      backgroundColor: theme.card,
      borderRadius: 12,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.border,
    },
    cardImage: {
      width: "100%",
      height: 140,
    },
    cardImagePlaceholder: {
      width: "100%",
      height: 140,
      backgroundColor: theme.border,
      alignItems: "center",
      justifyContent: "center",
    },
    placeholderIcon: {
      fontSize: 32,
    },
    cardTitle: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.text,
      padding: 10,
      lineHeight: 18,
    },
    addCard: {
      height: 188,
      alignItems: "center",
      justifyContent: "center",
      borderStyle: "dashed",
    },
    addIcon: {
      fontSize: 28,
      color: theme.subtext,
    },
    addText: {
      fontSize: 12,
      color: theme.subtext,
      marginTop: 4,
    },
    fab: {
      position: "absolute",
      bottom: 32,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.primary,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 999,
      boxShadow: "0px 2px 8px rgba(0,0,0,0.25)",
    },
    fabIcon: {
      fontSize: 28,
      color: "#ffffff",
      lineHeight: 32,
    },
  });
}
