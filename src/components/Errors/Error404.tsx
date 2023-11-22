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
      }}
      maxWidth="lg"
    >
      <Box
        sx={{
          color: "white",
          textAlign: "center",
          position: "relative",
          top: "-6rem",
        }}
      >
        <Typography
          color="secondary"
          sx={{ fontSize: 120, fontWeight: "bold" }}
        >
          4 oh 4
        </Typography>
        <Box sx={{ fontSize: 28, lineHeight: 1 }}>
          {children || "There is nothing under this link."}
        </Box>
      </Box>
    </Box>
  );
}
