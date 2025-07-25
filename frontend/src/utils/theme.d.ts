import "@mui/joy/styles";

declare module "@mui/joy/styles" {
  interface Palette {
    secondary: Palette["primary"];
  }
}
