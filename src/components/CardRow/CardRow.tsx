import type { BoxProps } from "@mui/material";
import type { Item } from "~/components/DotDotDotV2/DotDotDot";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { grey } from "@mui/material/colors";
import DotDotDot from "~/components/DotDotDotV2";

interface Props extends BoxProps {
  menuItems?: Item[];
  menuLabel?: string;
  chipLabel?: string;
}

export default function CardRow({
  sx,
  children,
  menuItems,
  menuLabel,
  chipLabel,
  ...rest
}: Props) {
  return (
    <Box
      sx={{
        borderBottom: `1px solid ${grey[900]}`,
        display: "flex",
        alignItems: "center",
        mb: 2,
        pb: 2,
        ":last-child": {
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
    </Box>
  );
}
