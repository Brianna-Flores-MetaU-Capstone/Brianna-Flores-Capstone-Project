import { extendTheme } from "@mui/joy/styles";

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          50: "#EAF5F3",
          100: "#DDEEEB",
          200: "#C2E0DB",
          300: "#A7D2CB",
          400: "#82BFB5",
          500: "#5DAC9F",
          600: "#478A7F",
          700: "#34655D",
          800: "#21403B",
          900: "#0E1B19",
        },
        secondary: {
          50: "#E6C5BD",
          100: "#E0B8AF",
          200: "#D49E91",
          300: "#C98474",
          400: "#B9604C",
          500: "#934A39",
          600: "#6B362A",
          700: "#43221A",
          800: "#1A0D0A",
          900: "#000000",
        },
        neutral: {
          "50": "#fafafa",
          "100": "#f5f5f5",
          "200": "#e5e5e5",
          "300": "#d4d4d4",
          "400": "#a3a3a3",
          "500": "#737373",
          "600": "#525252",
          "700": "#404040",
          "800": "#262626",
          "900": "#171717",
        },
        danger: {
          "50": "#fdf2f8",
          "100": "#fce7f3",
          "200": "#fbcfe8",
          "300": "#f9a8d4",
          "400": "#f472b6",
          "500": "#ec4899",
          "600": "#db2777",
          "700": "#be185d",
          "800": "#9d174d",
          "900": "#831843",
        },
        success: {
          "50": "#f0fdfa",
          "100": "#ccfbf1",
          "200": "#99f6e4",
          "300": "#5eead4",
          "400": "#2dd4bf",
          "500": "#14b8a6",
          "600": "#0d9488",
          "700": "#0f766e",
          "800": "#115e59",
          "900": "#134e4a",
        },
        warning: {
          "50": "#fff8e1",
          "100": "#ffecb3",
          "200": "#ffe082",
          "300": "#ffd54f",
          "400": "#ffca28",
          "500": "#ffc107",
          "600": "#ffb300",
          "700": "#ffa000",
          "800": "#ff8f00",
          "900": "#ff6f00",
        },
      },
    },
    dark: {
      palette: {},
    },
  },
  fontFamily: {
    display: "Inter, var(--joy-fontFamily-fallback)",
    body: "Inter, var(--joy-fontFamily-fallback)",
  },
  components: {
    JoyButton: {
      defaultProps: {
        variant: "outlined",
      },
    },
    JoyInput: {
      defaultProps: {
        variant: "outlined",
      },
    },
    JoyCard: {
      styleOverrides: {
        root: {
          width: 450,
        },
      },
      defaultProps: {
        variant: "outlined",
        color: "primary",
      },
    },
  },
});

const GPModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.body",
  boxShadow: "lg",
  p: 4,
  maxHeight: "70%",
  overflow: "auto",
  borderRadius: "lg",
};

const GPCenteredBoxStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  textAlign: "center",
  alignItems: "center",
  gap: 3,
};

export { GPModalStyle, GPCenteredBoxStyle, theme };
