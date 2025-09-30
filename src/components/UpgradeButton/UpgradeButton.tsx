import LockIcon from "@mui/icons-material/Lock";
import LaunchIcon from "@mui/icons-material/Launch";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";

interface Props {
  fullWidth?: boolean;
  text?: string;
  variant?: "contained" | "outlined" | "text";
}

export default function UpgradeButton({
  fullWidth = true,
  text = "Upgrade to enterprise",
  variant = "contained",
}: Props) {
  const Icon = text === "Upgrade to enterprise" ? LockIcon : LaunchIcon;
  const href = "https://app.stormkit.io/user/account";

  if (variant === "text") {
    return (
      <Link
        href={href}
        color="secondary"
        target="_blank"
        rel="noopener noreferrer"
        sx={{ textDecoration: "underline !important" }}
      >
        {text}
      </Link>
    );
  }

  return (
    <Button
      variant={variant}
      color="secondary"
      fullWidth={fullWidth}
      sx={{ mb: 1 }}
      startIcon={<Icon sx={{ fontSize: 16 }} />}
      target="_blank"
      rel="noopener noreferrer"
      href="https://app.stormkit.io/user/account"
    >
      {text}
    </Button>
  );
}
