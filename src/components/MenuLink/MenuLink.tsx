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
        bgcolor: item.isActive ? "rgba(255,255,255,0.05)" : undefined,
        ":hover": {
          opacity: 1,
          color: "white",
          bgcolor: "rgba(255,255,255,0.1)",
        },
      }}
    >
      {item.text}
    </Link>
  );
}
