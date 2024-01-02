import type { BoxProps } from "@mui/material";
import type { Item } from "~/components/DotDotDotV2/DotDotDot";
import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { grey } from "@mui/material/colors";
import DotDotDot from "~/components/DotDotDotV2";
import CardContext from "../Card/Card.context";

interface Props extends BoxProps {
  menuItems?: Item[];
  menuLabel?: string;
  chipLabel?: string;
  actions?: React.ReactNode;
}

export default function CardRow({
  sx,
  children,
  menuItems,
  menuLabel,
  chipLabel,
  actions,
  ...rest
}: Props) {
  const { size } = useContext(CardContext);
  const space = size === "medium" ? 4 : 2;

  return (
    <Box
      sx={{
        borderBottom: `1px solid ${grey[900]}`,
        display: "flex",
        alignItems: "center",
        px: space,
        py: 2,
        "&:nth-of-type(odd)": {
          bgcolor: "rgba(0,0,0,0.2)",
        },
        ":last-child": {
          mb: space,
          borderBottom: "none",
        },
        ...sx,
      }}
      {...rest}
    >
      <Box sx={{ flex: 1 }}>{children}</Box>
      {chipLabel && (
        <Chip
          label={chipLabel}
          size="small"
          sx={{ ml: 1, mr: menuItems ? 2 : 0 }}
        />
      )}
      {menuItems && <DotDotDot label={menuLabel} items={menuItems} />}
      {actions}
    </Box>
  );
}
