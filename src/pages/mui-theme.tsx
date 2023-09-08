import React from "react";
import { createTheme } from "@mui/material/styles";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from "react-router-dom";
import { LinkProps } from "@mui/material/Link";

const LinkBehavior = React.forwardRef<
  HTMLAnchorElement,
  Omit<RouterLinkProps, "to"> & { href: RouterLinkProps["to"] }
>((props, ref) => {
  const { href, ...other } = props;
  // Map href (MUI) -> to (react-router)
  return <RouterLink ref={ref} to={href} {...other} />;
});

const fontFamily = "Inter, sans-serif";
const fontSize = 13;

export default createTheme({
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      } as LinkProps,
      styleOverrides: {
        root: {
          color: "white",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        arrow: {
          color: "#070415",
        },
        popper: {
          padding: 4,
        },
        tooltip: {
          color: "white",
          backgroundColor: "#070415",
          fontSize: 14,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        standardWarning: {
          backgroundColor: "#b75c22",
          color: "white",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        colorWarning: {
          backgroundColor: "#b75c22",
          color: "white",
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          color: "white",
          backgroundColor: "rgba(0,0,0,0.2)",
          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.25)",
          },
          "&.Mui-focused": {
            backgroundColor: "rgba(0,0,0,0.25)",
          },
          "&:before": {
            borderColor: "rgba(255,255,255,0.1)",
          },
          "&:after": {
            borderColor: "rgba(255,255,255,0.5)",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          fontFamily,
          fontSize,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily,
          fontSize: 14,
          color: "white",
          opacity: 0.7,
          "&.Mui-focused": {
            color: "white",
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontFamily,
          fontSize,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily,
          fontSize,
        },
        body1: {
          fontFamily,
          fontSize,
        },
        h6: {
          fontFamily,
          fontSize: 15,
        },
        subtitle2: {
          fontFamily,
          fontWeight: "normal",
        },
      },
    },
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#0F092B",
      light: "#e7e5ee",
      contrastText: "#e7e5ee",
    },
    secondary: {
      main: "#78193B",
      light: "#e7e5ee",
      dark: "#f6005c",
      contrastText: "#e7e5ee",
    },
    text: {
      primary: "#a4a4a4",
    },
    background: {
      default: "#0F092B",
      paper: "#0a0621",
    },
    container: {
      default: "#1F1C3B",
      paper: "rgba(129,114,126,0.05)",
    },
    info: {
      main: "#a4a4a4",
      contrastText: "#B7AE22",
    },
    warning: {
      main: "#ffffff",
    },
  },
  breakpoints: {
    values: {
      xs: 320,
      sm: 384,
      md: 670,
      lg: 1024,
      xl: 1368,
    },
  },
});
