import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

const DUMMY_RECIPES = [
  {
    id: "1",
    title: "Classic Pancakes",
    image:
      "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/recipe-image-legacy-id-881465_10-7cc4719.jpg",
  },
  { id: "2", title: "Tandoori Chicken", image: null },
  { id: "3", title: "Blueberry Muffins", image: null },
  { id: "4", title: "Beef Stir Fry", image: null },
  { id: "5", title: "Avocado Toast", image: null },
];

type ViewMode = "single" | "compact";

export default function SearchScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("single");
  const inputRef = useRef<TextInput>(null);
  const styles = makeStyles(theme);

  useEffect(() => {
    const timeout = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timeout);
  }, []);

  const filtered = DUMMY_RECIPES.filter((r) =>
    r.title.toLowerCase().includes(query.toLowerCase()),
  );

  const listData = [
    { id: "create", title: "+ Create new recipe", image: null },
    ...filtered,
  ];

  function renderSingleCard({ item }: any) {
    if (item.id === "create") {
      return (
        <TouchableOpacity style={styles.createRow}>
          <View style={styles.createIconBox}>
            <Text style={styles.createPlus}>+</Text>
          </View>
          <Text style={styles.createLabel}>Create new recipe</Text>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity style={styles.singleCard}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.singleImage} />
        ) : (
          <View style={styles.singleImagePlaceholder}>
            <Text style={{ fontSize: 24 }}>🍽️</Text>
          </View>
        )}
        <Text style={styles.singleTitle} numberOfLines={2}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  }

  function renderCompactCard({ item }: any) {
    if (item.id === "create") {
      return (
        <TouchableOpacity style={styles.compactCard}>
          <View style={[styles.compactImage, styles.compactCreateBox]}>
            <Text style={styles.createPlus}>+</Text>
          </View>
          <Text style={styles.compactTitle} numberOfLines={2}>
            New
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity style={styles.compactCard}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.compactImage} />
        ) : (
          <View style={[styles.compactImage, styles.compactPlaceholder]}>
            <Text style={{ fontSize: 18 }}>🍽️</Text>
          </View>
        )}
        <Text style={styles.compactTitle} numberOfLines={2}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search bar row */}
      <View style={styles.searchRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>

        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Search recipes..."
          placeholderTextColor={theme.subtext}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          returnKeyType="search"
        />

        {/* View mode toggle */}
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() =>
            setViewMode((v) => (v === "single" ? "compact" : "single"))
          }
        >
          <Text style={styles.toggleIcon}>
            {viewMode === "single" ? "⊟" : "⊞"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      {viewMode === "single" ? (
        <FlatList
          data={listData}
          renderItem={renderSingleCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      ) : (
        <FlatList
          data={listData}
          renderItem={renderCompactCard}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.compactRow}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          key="compact"
        />
      )}
    </View>
  );
}

function makeStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: 48,
    },

    // Search bar
    searchRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      gap: 10,
      marginBottom: 16,
    },
    backArrow: {
      fontSize: 32,
      color: theme.text,
      lineHeight: 36,
    },
    input: {
      flex: 1,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      padding: 12,
      fontSize: 15,
      color: theme.text,
    },
    toggleButton: {
      padding: 8,
      backgroundColor: theme.card,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border,
    },
    toggleIcon: {
      fontSize: 18,
      color: theme.text,
    },

    listContent: {
      paddingHorizontal: 16,
      paddingBottom: 24,
    },

    // Single view
    createRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 18,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.border,
      marginBottom: 8,
    },
    createIconBox: {
      width: 48,
      height: 48,
      borderRadius: 10,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    createPlus: {
      fontSize: 22,
      color: theme.primary,
      fontWeight: "600",
    },
    createLabel: {
      fontSize: 15,
      color: theme.primary,
      fontWeight: "600",
    },
    singleCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 18,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.border,
    },
    singleImage: {
      width: 56,
      height: 56,
      borderRadius: 10,
    },
    singleImagePlaceholder: {
      width: 56,
      height: 56,
      borderRadius: 10,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: "center",
      justifyContent: "center",
    },
    singleTitle: {
      flex: 1,
      fontSize: 15,
      color: theme.text,
      fontWeight: "500",
    },

    // Compact view
    compactRow: {
      gap: 8,
      marginBottom: 8,
    },
    compactCard: {
      flex: 1,
      minWidth: 0, // prevents overflow on small screens
      maxWidth: "32%", // never wider than a third of the row
    },
    compactImage: {
      width: "100%",
      aspectRatio: 1, // always square regardless of width
      borderRadius: 10,
    },
    compactPlaceholder: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: "center",
      justifyContent: "center",
    },
    compactCreateBox: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    compactTitle: {
      fontSize: 11,
      color: theme.text,
      marginTop: 4,
      lineHeight: 14,
    },
  });
}
