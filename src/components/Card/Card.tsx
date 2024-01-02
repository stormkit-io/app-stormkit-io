import type { BoxProps } from "@mui/material";
import React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import CardHeader from "../CardHeader";
import CardFooter from "../CardFooter";
import CardRow from "../CardRow";

interface Props extends BoxProps {
  errorTitle?: boolean;
  error?: React.ReactNode;
  info?: React.ReactNode;
  success?: React.ReactNode;
  loading?: boolean;
  size?: "small" | "medium";
}

function Card({
  sx,
  errorTitle = true,
  error,
  success,
  info,
  children,
  loading,
  size = "medium",
  ...rest
}: Props) {
  let header;
  let footer;
  let content: React.ReactNode[] = [];
  let isCardRow = false;

  React.Children.forEach(children, child => {
    if (!React.isValidElement(child)) {
      return;
    }
    if (child.type === CardHeader) {
      header = child;
    } else if (child.type === CardFooter) {
      footer = child;
    } else {
      const { children } = child.props || {};

      if (Array.isArray(children) && children[0]?.type === CardRow) {
        isCardRow = true;
        content.push(
          React.Children.map(children, child => {
            return React.cloneElement(child, { size });
          })
        );
      } else {
        content.push(child);
      }
    }
  });

  const p = size === "small" ? 2 : 4;

  return (
    <Box
      sx={{
        m: "auto",
        bgcolor: "rgba(0,0,0,0.3)",
        border: `1px solid rgba(255,255,255,0.04)`,
        borderRadius: 1,
        pt: !header && content.length ? p : 0,
        pb: !footer && content.length ? p : 0,
        ...sx,
      }}
      {...rest}
    >
      {header && <Box sx={{ mb: content ? 4 : 0, px: p, pt: p }}>{header}</Box>}
      {content && !loading && (
        <Box sx={{ px: isCardRow ? 0 : p, flex: 1 }}>{content}</Box>
      )}
      {loading && (
        <Box sx={{ px: p, mb: footer ? p : 0, flex: 1 }}>
          <LinearProgress color="secondary" />
        </Box>
      )}
      {error && (
        <Alert color="error" sx={{ mb: footer ? p : 0, px: p }}>
          {errorTitle && <AlertTitle>Error</AlertTitle>}
          <Box>{error}</Box>
        </Alert>
      )}
      {success && (
        <Alert color="success" sx={{ mb: footer ? p : 0, px: p }}>
          <AlertTitle>Success</AlertTitle>
          <Box>{success}</Box>
        </Alert>
      )}
      {info && (
        <Alert
          color="info"
          sx={{
            mb: footer ? p : 0,
            px: p,
            bgcolor: "rgba(255,255,255,0.025)",
            borderRadius: 0,
          }}
        >
          <Box>{info}</Box>
        </Alert>
      )}
      {footer && (
        <Box
          sx={{
            px: p,
            py: 2,
            borderTop: `1px solid rgba(255,255,255,0.05)`,
          }}
        >
          {footer}
        </Box>
      )}
    </Box>
  );
}

export default Card;
