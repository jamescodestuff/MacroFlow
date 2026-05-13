import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function ProfileScreen({ navigation }: any) {
  const { theme, isDark, setIsDark } = useTheme();
  const styles = makeStyles(theme);

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>J</Text>
      </View>
      <Text style={styles.name}>James</Text>
      <Text style={styles.email}>james@email.com</Text>

      {/* Settings */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Dark Mode</Text>
          <Switch
            value={isDark}
            onValueChange={setIsDark}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor="#ffffff"
          />
        </View>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowLabel}>Change Password</Text>
          <Text style={styles.rowArrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowLabel}>About MacroFlow</Text>
          <Text style={styles.rowArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => navigation.replace("Login")}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

function makeStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 24,
      paddingTop: 64,
      alignItems: "center",
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.primary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
    },
    avatarText: {
      fontSize: 32,
      fontWeight: "700",
      color: "#ffffff",
    },
    name: {
      fontSize: 20,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 4,
    },
    email: {
      fontSize: 14,
      color: theme.subtext,
      marginBottom: 40,
    },
    section: {
      width: "100%",
      backgroundColor: theme.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: 16,
      marginBottom: 24,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 14,
    },
    rowLabel: {
      fontSize: 15,
      color: theme.text,
    },
    rowArrow: {
      fontSize: 20,
      color: theme.subtext,
    },
    divider: {
      height: 0.5,
      backgroundColor: theme.border,
    },
    logoutButton: {
      width: "100%",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.error,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
    },
    logoutText: {
      color: theme.error,
      fontSize: 16,
      fontWeight: "600",
    },
  });
}
