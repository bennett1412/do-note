import { createTheme, type MantineThemeColors } from "@mantine/core";

const surfaceDark = [
  "#0b0e0d", // 0
  "#232524", // 1
  "#3a3c3b", // 2
  "#535554", // 3
  "#6d6f6e", // 4
  "#898a89", // 5
  "#a0a2a1", // 6
  "#b6b8b7", // 7
  "#dce0de", // 8
  "#eff2f1", // 9
];

const surfaceLight = [
  "#ffffff", // 0
  "#f0f2f1", // 1
  "#e0e4e3", // 2
  "#d0d4d3", // 3
  "#bcc0bf", // 4
  "#a8acab", // 5
  "#949897", // 6
  "#808483", // 7
  "#6c706f", // 8
  "#585c5b", // 9
];

const primaryDark = [
  "#eff2f1", // 0
  "#f1f3f3", // 1
  "#f3f5f4", // 2
  "#f4f6f6", // 3
  "#f6f8f7", // 4
  "#f8f9f9", // 5
  "#ffffff", // 6
  "#ffffff", // 7
  "#ffffff", // 8
  "#ffffff", // 9
];

const primaryLight = [
  "#0b0e0d", // 0
  "#2e2e2e", // 1
  "#595a5a", // 2
  "#888a89", // 3
  "#babcbc", // 4
  "#eff2f1", // 5
  "#ffffff", // 6
  "#ffffff", // 7
  "#ffffff", // 8
  "#ffffff", // 9
];

export const theme = createTheme({
  colors: {
    surface: surfaceDark,
    primary: primaryDark,
  } as MantineThemeColors,
  primaryColor: "primary",
  defaultRadius: "md",
  fontFamily: "Inter, Avenir, Helvetica, Arial, sans-serif",
  autoContrast: true,
  luminanceThreshold: 0.4,
  components: {
    Button: {
      vars: (_, props: any) => {
        if (props.variant === "subtle" && props.color === "gray") {
          return {
            root: {
              "--button-hover": "var(--mantine-color-surface-2)",
              "--button-active": "var(--mantine-color-surface-3)",
            },
          };
        }
        return { root: {} };
      },
    },
  },
});

export const themeColors = {
  dark: { surface: surfaceDark, primary: primaryDark } as const,
  light: { surface: surfaceLight, primary: primaryLight } as const,
};
