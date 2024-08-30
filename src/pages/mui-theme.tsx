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

const fontFamily = "Roboto, Helvetica, Arial, sans-serif";
const fontSize = 13;

export default (mode: "dark" | "light") => {
  const isDark = mode === "dark";
  const primaryColor = isDark ? "white" : "black";

  return createTheme({
    typography: {
      fontWeightBold: 800,
      fontWeightMedium: 600,
      fontWeightRegular: 500,
      fontWeightLight: 400,
    },
    components: {
      MuiLink: {
        defaultProps: {
          component: LinkBehavior,
        } as LinkProps,
        styleOverrides: {
          root: {
            color: primaryColor,
            textDecoration: "none",
            ":hover": {
              color: isDark ? purple[100] : grey[600],
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
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: primaryColor,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            color: primaryColor,
            "&:hover": {
              color: primaryColor,
            },
            "&.Mui-disabled": {
              color: primaryColor,
              opacity: "0.25",
            },
          },
        },
        variants: [
          {
            props: { variant: "text", color: "info" },
            style: { color: primaryColor },
          },
        ],
      },
      MuiCircularProgress: {
        styleOverrides: {
          root: {
            color: "white",
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          standardInfo: {
            backgroundColor: isDark ? "#0f4c64" : "#92d1e9",
            color: isDark ? "#ffffff" : "#0f4c64",
          },
          standardError: {
            backgroundColor: "#460e0e",
            color: "#ffffff",
          },
          standardWarning: {
            backgroundColor: "#b75c22",
            color: "#ffffff",
          },
          standardSuccess: {
            backgroundColor: isDark ? "#003801" : "#94e395",
            color: isDark ? "#ffffff" : "#003801",
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
            color: primaryColor,
            backgroundColor: isDark ? "#090518" : "#ffffff",
            "&:hover": {
              backgroundColor: isDark ? "#090614" : grey[300],
            },
            "&.Mui-focused": {
              backgroundColor: isDark ? "#000000" : grey[200],
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
            color: primaryColor,
            opacity: 0.7,
            "&.Mui-focused": {
              color: primaryColor,
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
    palette:
      mode === "dark"
        ? {
            primary: {
              main: grey[600],
              light: "#e7e5ee",
              contrastText: "#e7e5ee",
            },
            secondary: {
              main: "#78193b",
              light: "#e7e5ee",
              dark: "#f6005c",
              contrastText: "#e7e5ee",
            },
            text: {
              primary: "#ffffff",
              secondary: grey[500],
            },
            background: {
              default: "#0F092B",
              paper: "#0b061e",
            },
            container: {
              default: "#1F1C3B",
              paper: "#090518",
              border: "#111111",
            },
            info: {
              main: "#0d84bf",
              contrastText: "#B7AE22",
              dark: "#f9f9f9",
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
          }
        : {
            primary: {
              main: "#000000",
              light: "#e7e5ee",
              contrastText: "#e7e5ee",
            },
            secondary: {
              main: "#f6005c",
              light: "#e7e5ee",
              dark: "#78193b",
              contrastText: "#e7e5ee",
            },
            text: {
              primary: "#000000",
              secondary: grey[800],
            },
            background: {
              default: "#f1f3f4",
              paper: "#ffffff",
            },
            container: {
              default: "#1F1C3B",
              paper: "rgba(129,114,126,0.05)",
              border: "#ffffff",
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
};
