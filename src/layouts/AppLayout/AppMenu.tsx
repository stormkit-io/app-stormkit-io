import { useMemo } from "react";
import { useLocation } from "react-router";
import Box from "@mui/material/Box";
import ArrowBack from "@mui/icons-material/ArrowBack";
import AppName from "~/components/AppName";
import MenuLink from "~/components/MenuLink";
import { appMenuItems } from "./menu_items";

interface Props {
  app: App;
  team?: Team;
}

export default function AppMenu({ app, team }: Props) {
  const { pathname } = useLocation();

  const appMenu = useMemo(
    () => appMenuItems({ app, pathname }),
    [app, pathname]
  );

  return (
    <Box
      component="header"
      bgcolor="background.paper"
      sx={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "100%",
        zIndex: 100,
        px: 2,
        py: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box sx={{ mr: 2, display: "flex", alignItems: "center" }}>
          <MenuLink
            sx={{
              mr: 2,
              px: { xs: 1, md: 1 },
              pr: { xs: 1, md: 2 },
              bgcolor: "container.transparent",
              color: "text.secondary",
            }}
            item={{
              text: team?.isDefault ? "My apps" : `${team?.name} Team Apps`,
              path: `/${team?.slug || ""}`,
              icon: <ArrowBack sx={{ fontSize: 18, mr: 1 }} />,
            }}
          />
          <Box sx={{ pt: 0.25 /* fixes an alignment issue with buttons */ }}>
            <AppName app={app} />
          </Box>
        </Box>
        <Box>
          {appMenu.map(item => (
            <MenuLink key={item.path} item={item} sx={{ mr: 1 }} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
