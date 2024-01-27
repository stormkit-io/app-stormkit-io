import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { LS_PROVIDER } from "~/utils/api/Api";
import { LocalStorage } from "~/utils/storage";

interface MenuItem {
  to: string;
  text: string;
  label?: string;
}

const menuItems: MenuItem[][] = [
  [
    { to: `/apps/new/${LocalStorage.get(LS_PROVIDER)}`, text: "New App" },
    { to: "/", text: "My Apps" },
    // { to: "/my/deployments", text: "My Deployments" },
  ],
  [
    {
      to: "https://www.stormkit.io/docs",
      text: "Stormkit Docs",
    },
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
  return (
    <Box component="section" role="menu" sx={{ p: 2, minWidth: "250px" }}>
      <Box className="flex flex-col flex-1">
        <Box
          sx={{ pb: 2, mb: 2, borderBottom: "1px solid rgba(255,255,255,0.1)" }}
        >
          <Typography>{user.fullName || user.displayName}</Typography>
          <Typography>{user.email}</Typography>
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
