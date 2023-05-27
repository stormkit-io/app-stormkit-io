import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    container: Palette["primary"];
  }

  interface PaletteOptions {
    container: PaletteOptions["primary"];
  }
}
