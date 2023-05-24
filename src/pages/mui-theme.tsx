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

export default createTheme({
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      } as LinkProps,
    },
    MuiTooltip: {
      styleOverrides: {
        tooltipArrow: {
          backgroundColor: "black",
        },
        popper: {
          padding: 4,
        },
        tooltip: {
          backgroundColor: "black",
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
      paper: "#070415",
    },
    info: {
      main: "#f9f9f9",
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
      md: 576,
      lg: 1024,
      xl: 1368,
    },
  },
});
