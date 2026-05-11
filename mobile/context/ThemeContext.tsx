import { createContext, useContext, useState } from "react";

// light and dark themes
export const lightTheme = {
  background: "#FFFFFF",
  card: "#F5F5F5",
  text: "#1A1A1A",
  subtext: "#888888",
  primary: "#2E7D32",
  border: "#E0E0E0",
  error: "#D32F2F",
};

export const darkTheme = {
  background: "#121212",
  card: "#1E1E1E",
  text: "#F5F5F5",
  subtext: "#AAAAAA",
  primary: "#66BB6A",
  border: "#2C2C2C",
  error: "#EF5350",
};

const ThemeContext = createContext<any>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
