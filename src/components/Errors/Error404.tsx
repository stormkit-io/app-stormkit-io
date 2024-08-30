import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface Props {
  withLogo?: boolean;
  children?: React.ReactNode;
}

export default function Error404({ children }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        m: "auto",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "400px",
      }}
      maxWidth="lg"
    >
      <Box sx={{ textAlign: "center" }}>
        <Typography
          color="secondary"
          sx={{ fontSize: 120, fontWeight: "bold" }}
        >
          4 oh 4
        </Typography>
        <Box sx={{ fontSize: 28, lineHeight: 1 }}>
          {children || "There is nothing under this link"}
        </Box>
      </Box>
    </Box>
  );
}
