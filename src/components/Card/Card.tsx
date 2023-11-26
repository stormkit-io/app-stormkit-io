import type { BoxProps } from "@mui/material";
import React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import CardHeader from "../CardHeader";
import CardFooter from "../CardFooter";

interface Props extends BoxProps {
  errorTitle?: boolean;
  error?: React.ReactNode;
  success?: React.ReactNode;
}

function Card({
  sx,
  errorTitle = true,
  error,
  success,
  children,
  ...rest
}: Props) {
  let header;
  let footer;
  let content: React.ReactNode[] = [];

  React.Children.forEach(children, child => {
    if (!React.isValidElement(child)) {
      return;
    }
    if (child.type === CardHeader) {
      header = child;
    } else if (child.type === CardFooter) {
      footer = child;
    } else {
      content.push(child);
    }
  });

  return (
    <Box
      sx={{
        m: "auto",
        bgcolor: "rgba(0,0,0,0.3)",
        border: `1px solid rgba(255,255,255,0.04)`,
        borderRadius: 1,
        pb: !footer ? 4 : 0,
        ...sx,
      }}
      {...rest}
    >
      {header && <Box sx={{ mb: 4, px: 4, pt: 4 }}>{header}</Box>}
      <Box sx={{ px: 4 }}>{content}</Box>
      {error && (
        <Alert color="error" sx={{ mb: footer ? 4 : 0, px: 4 }}>
          {errorTitle && <AlertTitle>Error</AlertTitle>}
          <Box>{error}</Box>
        </Alert>
      )}
      {success && (
        <Alert color="success" sx={{ mb: footer ? 4 : 0, px: 4 }}>
          <AlertTitle>Success</AlertTitle>
          <Box>{success}</Box>
        </Alert>
      )}
      {footer && (
        <Box
          sx={{
            px: 4,
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
