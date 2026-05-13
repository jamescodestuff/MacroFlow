import { View, Text } from "react-native";
import { useTheme } from "../context/ThemeContext";
export default function SearchScreen() {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: theme.text }}>Search Screen</Text>
    </View>
  );
}
