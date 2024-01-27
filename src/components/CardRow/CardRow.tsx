import type { BoxProps } from "@mui/material";
import type { Item } from "~/components/DotDotDotV2/DotDotDot";
import React, { useContext } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import DotDotDot from "~/components/DotDotDotV2";
import CardContext from "../Card/Card.context";
import { grey } from "@mui/material/colors";

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
        borderBottom: `1px solid rgba(255,255,255,0.04)`,
        display: "flex",
        flexDirection: "column",
        ":first-child": {
          borderTop: `1px solid rgba(255,255,255,0.04)`,
        },
        ":last-child": {
          borderBottom: "none",
        },
        ...sx,
      }}
      {...rest}
    >
      <Box
        sx={{
          display: "flex",
          flex: 1,
          alignItems: "stretch",
          px: space,
          py: 2,
        }}
      >
        <Box sx={{ flex: 1 }}>{children}</Box>
        {chipLabel && (
          <Chip
            label={chipLabel}
            size="small"
            sx={{ ml: 1, mr: menuItems ? 2 : 0 }}
          />
        )}
        {(menuItems || actions) && (
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexDirection: "column",
            }}
          >
            {menuItems && <DotDotDot label={menuLabel} items={menuItems} />}
            {actions}
          </Box>
        )}
      </Box>
    </Box>
  );
}
