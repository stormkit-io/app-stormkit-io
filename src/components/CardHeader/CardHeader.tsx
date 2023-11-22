import { BoxProps } from "@mui/material/Box";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";

interface Props extends BoxProps {
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}

export default function CardHeader({
  sx,
  subtitle,
  actions,
  title,
  children,
  ...rest
}: Props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ flex: 1, ...sx }} {...rest}>
        {title && (
          <Typography
            variant="h2"
            sx={{ fontSize: 20, mb: subtitle ? 0.5 : 0 }}
          >
            {title}
          </Typography>
        )}
        {title && subtitle && (
          <Typography variant="subtitle2" sx={{ opacity: 0.5 }}>
            {subtitle}
          </Typography>
        )}
        {children}
      </Box>
      {actions}
    </Box>
  );
}
