import React from "react";
import Box, { BoxProps } from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface Props extends Omit<BoxProps, "title"> {
  title?: React.ReactNode;
  actions?: React.ReactNode;
}

export default function ContainerV2({ title, actions, children, sx }: Props) {
  return (
    <Box maxWidth="md" sx={{ width: "100%", bgcolor: "container.main", ...sx }}>
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
          {title && (
            <Typography variant="h5" sx={{ fontSize: 16 }}>
              {title}
            </Typography>
          )}
          {actions}
        </Box>
      )}
      {children && <Box sx={{ color: "white" }}>{children}</Box>}
    </Box>
  );
}
