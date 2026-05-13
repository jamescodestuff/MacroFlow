import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

const SCREEN_WIDDTH = Dimensions.get("window").width;

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

export default function BookScreen({ nagivation }: any) {
  const { theme } = useTheme();
  const styles = makeStyles(theme);

  function renderRecipeCard({ item }: any) {
    if (item.id === "add") {
      return (
        <TouchableOpacity
          style={[styles.card, styles.addCard]}
          onPress={() => nagivation.navigate("import")}
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
        data={[...DUMMY_RECIPES, { id: "add" }]}
        renderItem={renderRecipeCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.grid}
      />
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
      height: 110,
    },
    cardImagePlaceholder: {
      width: "100%",
      height: 110,
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
      padding: 8,
      lineHeight: 18,
    },
    addCard: {
      height: 160,
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
  });
}
