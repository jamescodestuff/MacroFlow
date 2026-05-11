import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function RegisterScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const styles = makeStyles(theme);

  function handleRegister() {
    // Basic validation
    if (!name || !email || !password || !confirm) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Clear error and go to main app
    setError("");
    navigation.replace("Main");
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Text style={styles.logo}>🍽️ MacroFlow</Text>
        <Text style={styles.subtitle}>Create your account</Text>

        {/* Error message */}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Name Input */}
        <TextInput
          style={styles.input}
          placeholder="Full name"
          placeholderTextColor={theme.subtext}
          value={name}
          onChangeText={setName}
        />

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

        {/* Confirm Password */}
        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          placeholderTextColor={theme.subtext}
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
        />

        {/* Register Button */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        {/* Back to Login */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>
            Already have an account? <Text style={styles.linkBold}>Log in</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function makeStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: theme.background,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
      paddingVertical: 48,
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
    error: {
      color: theme.error,
      fontSize: 14,
      marginBottom: 16,
      textAlign: "center",
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
