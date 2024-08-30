import "@mui/material/styles";

interface CustomTypeBackground {
  default: string;
  paper: string;
  border: string;
  transparent: string;
}

declare module "@mui/material/styles" {
  interface Palette {
    container: CustomTypeBackground;
  }

  interface PaletteOptions {
    container: CustomTypeBackground;
  }
}
