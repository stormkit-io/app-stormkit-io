import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

export interface Path {
  path: string;
  icon?: React.ReactNode;
  text: React.ReactNode;
  isActive?: boolean;
}

interface Props {
  item: Path;
}

export default function MenuLink({ item }: Props) {
  return (
    <Link
      key={item.path}
      href={item.path}
      sx={{
        cursor: "pointer",
        color: "white",
        px: { xs: 1, md: 2 },
        py: 0.5,
        display: "inline-flex",
        position: "relative",
        alignItems: "center",
        borderRadius: 1,
        ":hover": {
          opacity: 1,
          color: "white",
          bgcolor: "rgba(255,255,255,0.1)",
        },
      }}
    >
      {item.text}
      {item.isActive && (
        <Box
          sx={{
            height: "2px",
            bgcolor: "white",
            position: "absolute",
            bottom: -8,
            left: 16,
            right: 16,
          }}
        />
      )}
    </Link>
  );
}
