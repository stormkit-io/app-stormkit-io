import type { BoxProps } from "@mui/material";
import React, { useState, useEffect } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import ReportIcon from "@mui/icons-material/Report";
import LinearProgress from "@mui/material/LinearProgress";
import CardHeader from "../CardHeader";
import CardFooter from "../CardFooter";
import CardRow from "../CardRow";
import CardContext, { Size } from "./Card.context";

interface Props extends BoxProps {
  errorTitle?: boolean;
  error?: React.ReactNode;
  info?: React.ReactNode;
  success?: React.ReactNode;
  contentPadding?: boolean; // When false, the content will not have padding x.
  loading?: boolean;
  size?: Size;
}

function Card({
  sx,
  errorTitle = true,
  error,
  success,
  info,
  children,
  loading,
  contentPadding = true,
  size = "medium",
  ...rest
}: Props) {
  let header;
  let footer;
  let content: React.ReactNode[] = [];
  let isCardRow = false;
  const [isLoadingFirstTime, setIsLoadingFirstTime] = useState<boolean>();

  useEffect(() => {
    if (typeof isLoadingFirstTime === "undefined" || isLoadingFirstTime) {
      setIsLoadingFirstTime(loading);
    }
  }, [loading]);

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
      }

      content.push(child);
    }
  });

  const p = size === "small" ? 2 : 4;

  return (
    <CardContext.Provider value={{ size }}>
      <Box
        sx={{
          m: "auto",
          bgcolor: "background.paper",
          border: `1px solid rgba(255,255,255,0.04)`,
          borderRadius: 1,
          position: "relative",
          pt: !header && content.length ? p : 0,
          pb: !footer && content.length ? p : 0,
          ...sx,
        }}
        {...rest}
      >
        {header}
        {content && !isLoadingFirstTime && (
          <Box sx={{ px: isCardRow || !contentPadding ? 0 : p, flex: 1 }}>
            {content}
          </Box>
        )}
        {loading && (
          <Box
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              flex: 1,
            }}
          >
            <LinearProgress color="secondary" />
          </Box>
        )}
        {error && (
          <Alert color="error" sx={{ mb: footer ? p : 0, px: p, mx: p }}>
            {errorTitle && <AlertTitle>Error</AlertTitle>}
            <Box>{error}</Box>
          </Alert>
        )}
        {success && (
          <Alert color="success" sx={{ mb: footer ? p : 0, px: p, mx: p }}>
            <AlertTitle>Success</AlertTitle>
            <Box>{success}</Box>
          </Alert>
        )}
        {info && (
          <Alert
            color="info"
            icon={<ReportIcon />}
            sx={{
              mb: footer ? p : 0,
              px: p,
              mx: p,
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
              pt: isLoadingFirstTime ? p : 2,
              borderTop: `1px solid rgba(255,255,255,0.04)`,
            }}
          >
            {footer}
          </Box>
        )}
      </Box>
    </CardContext.Provider>
  );
}

export default Card;
