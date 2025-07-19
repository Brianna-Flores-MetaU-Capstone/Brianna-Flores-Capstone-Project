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
          50: "#FEE1E3",
          100: "#FDCED1",
          200: "#FBA7AD",
          300: "#F98088",
          400: "#F75964",
          500: "#F53240",
          600: "#E40B1B",
          700: "#AE0914",
          800: "#79060E",
          900: "#430308",
        },
        success: {
          50: "#33FDDB",
          100: "#1FFDD8",
          200: "#02F0C9",
          300: "#02C8A7",
          400: "#019079",
          500: "#01594A",
          600: "#00211C",
          700: "#000000",
          800: "#000000",
          900: "#000000",
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
    JoyFormHelperText: {
      defaultProps: {
        color: "error",
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

const GPDiffHeaderStyle = {
  mt: 3,
  bgcolor: "primary.200",
  p: 2,
  borderRadius: "lg",
};

const BaseListStyle = {
  display: "flex",
  gap: 3,
}

const RowOverflowTitledListStyle = {
  ...BaseListStyle,
  overflowX: "auto",
}

const ColumnOverflowTitledListStyle = {
  ...BaseListStyle,
  flexDirection: "column",
  overflowY: "auto" 
}

const CenteredTitledListStyle = {
  ...BaseListStyle,
  flexWrap: "wrap",
  justifyContent: "center",
}

const MUI_GRID_FULL_SPACE = 12;

export { GPModalStyle, GPCenteredBoxStyle, GPDiffHeaderStyle, theme, MUI_GRID_FULL_SPACE, RowOverflowTitledListStyle, ColumnOverflowTitledListStyle, CenteredTitledListStyle };
