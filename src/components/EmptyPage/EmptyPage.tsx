import type { SxProps } from "@mui/material";
import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import emptyListSvg from "~/assets/images/empty-list.svg";

interface Props {
  sx?: SxProps;
  children?: React.ReactNode;
}

export default function EmptyList({ sx, children }: Props) {
  return (
    <Box sx={{ textAlign: "center", my: 12, ...sx }}>
      <img src={emptyListSvg} alt="Empty app list" className="m-auto" />
      <Typography sx={{ mt: 6 }}>
        {children || <>It's quite empty in here.</>}
      </Typography>
    </Box>
  );
}
