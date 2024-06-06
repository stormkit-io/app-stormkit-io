import React from "react";
import { createTheme } from "@mui/material/styles";
import { grey, purple } from "@mui/material/colors";
import { Link as RLink, LinkProps as RLinkProps } from "react-router-dom";
import { LinkProps } from "@mui/material/Link";

// Map href (MUI) -> to (react-router)
const LinkBehavior = React.forwardRef<
  HTMLAnchorElement,
  Omit<RLinkProps, "to"> & { href: RLinkProps["to"] }
>((props, ref) => {
  const { href, ...other } = props;
  return <RLink ref={ref} to={href} {...other} />;
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
          textDecoration: "none",
          ":hover": {
            color: purple[300],
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        arrow: {
          color: grey[900],
        },
        popper: {
          padding: 0,
        },
        tooltip: {
          color: "white",
          backgroundColor: "#1F1C3B",
          border: `1px solid ${grey[900]}`,
          fontSize: 14,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          "&:hover": {
            color: "white",
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        standardInfo: {
          backgroundColor: "rgba(255,255,255,0.1)",
        },
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
            borderColor: grey[900],
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
      main: grey[600],
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
      main: "#0d84bf",
      contrastText: "#B7AE22",
    },
    warning: {
      main: "#ffffff",
    },
    error: {
      main: "#d32f2f",
      light: "#ef5350",
      dark: "#c62828",
    },
    success: {
      main: "#1d5a20",
      light: "#4caf50",
      dark: "#1b5e20",
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
