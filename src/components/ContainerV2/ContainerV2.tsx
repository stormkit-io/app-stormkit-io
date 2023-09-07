import React from "react";
import Box, { BoxProps } from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface Props extends Omit<BoxProps, "title"> {
  subtitle?: React.ReactNode;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  bgcolor?: string;
}

export default function ContainerV2({
  title,
  subtitle,
  actions,
  children,
  maxWidth = "md",
  bgcolor = "container.paper",
  sx,
}: Props) {
  return (
    <Box maxWidth={maxWidth} sx={{ width: "100%", bgcolor, ...sx }}>
      {(title || actions) && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            color: "white",
          }}
        >
          <Box>
            {title && (
              <Typography variant="h5" sx={{ fontSize: 16 }}>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="h6" sx={{ fontSize: 14, opacity: 0.65 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {actions}
        </Box>
      )}
      {children && <Box sx={{ color: "white" }}>{children}</Box>}
    </Box>
  );
}
