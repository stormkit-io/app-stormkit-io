import type { SxProps } from "@mui/material";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

export interface Path {
  path: string;
  icon?: React.ReactNode;
  text: React.ReactNode;
  isActive?: boolean;
}

interface Props {
  item: Path;
  sx?: SxProps;
}

export default function MenuLink({ item, sx }: Props) {
  return (
    <Typography component="span">
      <Link
        key={item.path}
        href={item.path}
        sx={{
          cursor: "pointer",
          px: { xs: 1, md: 2 },
          py: 0.5,
          display: "inline-flex",
          position: "relative",
          alignItems: "center",
          borderRadius: 1,
          bgcolor: item.isActive ? "rgba(255,255,255,0.05)" : undefined,
          ":hover": {
            opacity: 1,
            bgcolor: "rgba(255,255,255,0.1)",
          },
          ...sx,
        }}
      >
        {item.icon}
        {item.text}
      </Link>
    </Typography>
  );
}
