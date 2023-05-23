import Box from "@mui/material/Box";
import logoText from "~/assets/logos/stormkit-logo-text-h-white.svg";
import logoIcon from "~/assets/logos/stormkit-logo-circle.svg";

interface Props {
  iconOnly?: boolean;
  iconSize?: number;
}

export default function Logo({ iconOnly = false, iconSize = 16 }: Props) {
  return (
    <Box
      component="img"
      src={iconOnly ? logoIcon : logoText}
      alt="Stormkit Logo"
      sx={{
        maxWidth: "none",
        width: iconSize,
        height: iconOnly ? iconSize : "auto",
      }}
    />
  );
}
