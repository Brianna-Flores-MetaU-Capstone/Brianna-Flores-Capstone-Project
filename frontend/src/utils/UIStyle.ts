import { extendTheme } from "@mui/joy/styles";

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        // affects all Joy components that has `color="primary"` prop.
        primary: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          // 300, 400, ..., 800,
          300: "#fde68a",
          400: "#fde68a",
          500: "#fde68a",
          600: "#fde68a",
          700: "#fde68a",
          800: "#fde68a",
          900: "#78350f",
        },
        neutral: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          // 300, 400, ..., 800,
          300: "#fde68a",
          400: "#fde68a",
          500: "#fde68a",
          600: "#fde68a",
          700: "#fde68a",
          800: "#fde68a",
          900: "#78350f",
        },
      },
    },
  },
  fontFamily: {
    display: "Inter, var(--joy-fontFamily-fallback)",
    body: "Inter, var(--joy-fontFamily-fallback)",
  },
});

const GPModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  boxShadow: "lg",
  p: 4,
  maxHeight: "70%",
  overflow: "auto",
  borderRadius: "md",
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
