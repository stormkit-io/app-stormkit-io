import "@mui/material/styles";
import { TypeBackground } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    container: TypeBackground;
  }

  interface PaletteOptions {
    container: TypeBackground;
  }
}
