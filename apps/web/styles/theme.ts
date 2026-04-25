import { createTheme } from "@mantine/core";

export const theme = createTheme({
  colors: {
    // Mapping "surface" colors (dark grays) to a custom 'dark' palette or similar
    // Using the values from globals.scss
    surface: [
      "#0b0e0d", // 0 (100 in css)
      "#232524", // 1 (200 in css)
      "#3a3c3b", // 2 (300 in css)
      "#535554", // 3 (400 in css)
      "#6d6f6e", // 4 (500 in css)
      "#898a89", // 5 (600 in css)
      "#a0a2a1", // Placeholder for 6
      "#b6b8b7", // Placeholder for 7
      "#dce0de", // Placeholder for 8
      "#eff2f1", // Placeholder for 9
    ],
    // Mapping "primary" colors (light whites/grays)
    primary: [
      "#eff2f1", // 0 (100)
      "#f1f3f3", // 1 (200)
      "#f3f5f4", // 2 (300)
      "#f4f6f6", // 3 (400)
      "#f6f8f7", // 4 (500)
      "#f8f9f9", // 5 (600)
      "#ffffff", // Placeholder
      "#ffffff", // Placeholder
      "#ffffff", // Placeholder
      "#ffffff", // Placeholder
    ],
  },
  primaryColor: "primary",
  defaultRadius: "md",
  fontFamily: "Inter, Avenir, Helvetica, Arial, sans-serif",
  components: {
    Button: {
      vars: (_, props: any) => {
        if (props.variant === "subtle" && props.color === "gray") {
          return {
            root: {
              "--button-hover": "var(--color-surface-300)",
              "--button-active": "var(--color-surface-400)",
            },
          };
        }
        return { root: {} };
      },
    },
  },
});
