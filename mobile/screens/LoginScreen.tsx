import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function LoginScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const styles = makeStyles(theme);

  return (
    <View style={styles.container}>
      {/* Logo / Title */}
      <Text style={styles.logo}>🍽️ MacroFlow</Text>
      <Text style={styles.subtitle}>Your personal recipe book</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={theme.subtext}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={theme.subtext}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Login Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace("Main")}
      >
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      {/* Register Link */}
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>
          Don't have an account? <Text style={styles.linkBold}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function makeStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
    },
    logo: {
      fontSize: 36,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.subtext,
      marginBottom: 48,
    },
    input: {
      width: "100%",
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: theme.text,
      marginBottom: 16,
    },
    button: {
      width: "100%",
      backgroundColor: theme.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      marginBottom: 24,
      marginTop: 8,
    },
    buttonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    link: {
      color: theme.subtext,
      fontSize: 14,
    },
    linkBold: {
      color: theme.primary,
      fontWeight: "600",
    },
  });
}
