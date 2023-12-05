import { BoxProps } from "@mui/material/Box";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";
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
    <Box sx={{ display: "flex", alignItems: "center", ...sx }} {...rest}>
      <Box sx={{ flex: 1 }}>
        {title && (
          <Typography
            variant="h2"
            sx={{ fontSize: 20, mb: subtitle ? 0.5 : 0 }}
          >
            {title}
          </Typography>
        )}
        {title && subtitle && (
          <Typography variant="subtitle2" sx={{ color: grey[500] }}>
            {subtitle}
          </Typography>
        )}
        {children}
      </Box>
      {actions}
    </Box>
  );
}
