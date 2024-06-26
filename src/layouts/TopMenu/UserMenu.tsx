import { useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import ReportIcon from "@mui/icons-material/Report";
import { grey } from "@mui/material/colors";

interface MenuItem {
  to: string;
  text: string;
  label?: string;
}

const menuItems: MenuItem[][] = [
  [
    {
      to: "https://www.stormkit.io/docs",
      text: "Stormkit Docs",
    },
  ],
  [
    { to: "/user/account", text: "Account" },
    { to: "/logout", text: "Log out" },
  ],
];

const footerItems: MenuItem[] = [
  { to: "https://twitter.com/stormkitio", text: "fab fa-twitter", label: "X" },
  {
    to: "https://www.youtube.com/channel/UC6C_-UuAiIWlGOIokT03lRQ",
    text: "fab fa-youtube",
    label: "YouTube",
  },
  {
    to: "https://discord.gg/6yQWhyY",
    text: "fab fa-discord",
    label: "Discord",
  },
  { to: "mailto:hello@stormkit.io", text: "fa fa-envelope", label: "Email" },
];

interface Props {
  user: User;
  onClick?: () => void;
}

export default function UserMenu({ user, onClick }: Props) {
  const userPackage = user?.package?.id || "free";
  const isPaymentRequired = userPackage === "free" && user?.isPaymentRequired;

  const freeTrialEnds = useMemo(() => {
    if (user?.freeTrialEnds) {
      return new Date(user.freeTrialEnds * 1000).toLocaleDateString("en", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
      });
    }
  }, [user?.freeTrialEnds]);

  return (
    <Box component="section" role="menu" sx={{ p: 2, minWidth: "250px" }}>
      <Box className="flex flex-col flex-1">
        <Box
          sx={{ pb: 2, mb: 3, borderBottom: "1px solid rgba(255,255,255,0.1)" }}
        >
          <Typography>{user.fullName || user.displayName}</Typography>
          <Typography sx={{ color: grey[500] }}>{user.email}</Typography>
          {isPaymentRequired && (
            <Alert icon={<ReportIcon />} color="info" sx={{ mt: 1.5 }}>
              <Link href="/user/account">
                Free trial ends on {freeTrialEnds}
              </Link>
            </Alert>
          )}
        </Box>
        {menuItems.map((section, index) => (
          <Box
            key={index}
            sx={{ borderBottom: "1px solid rgba(255,255,255,0.1)", mb: 3 }}
          >
            {section.map(item => (
              <Box key={item.text} sx={{ pb: 3 }}>
                <Link
                  href={item.to}
                  sx={{ display: "block" }}
                  onClick={onClick}
                >
                  {item.text}
                </Link>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
      <Box sx={{ textAlign: "center" }}>
        {footerItems.map(item => (
          <Link
            key={item.to}
            href={item.to}
            target="_blank"
            rel="noreferrer nooopener"
            aria-label={item.label}
            sx={{
              mr: 2,
              fontSize: 20,
              display: "inline-block",
              ":last-child": { mr: 0 },
            }}
          >
            <Box component="span" className={item.text} />
          </Link>
        ))}
      </Box>
    </Box>
  );
}
