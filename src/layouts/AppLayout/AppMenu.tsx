import { useMemo } from "react";
import { useLocation } from "react-router";
import Box from "@mui/material/Box";
import AppName from "~/components/AppName";
import MenuLink from "~/components/MenuLink";
import { appMenuItems } from "./menu_items";

interface Props {
  app: App;
}

export default function AppMenu({ app }: Props) {
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
        color: "white",
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
        <Box sx={{ mr: 2 }}>
          <AppName
            repo={app.repo}
            withLinkToRepo
            wrapOnMobile
            sx={{ mr: 2 }}
            imageSx={{ width: 28 }} // Same as Stormkit Icon
          />
        </Box>
        <Box>
          {appMenu.map(item => (
            <MenuLink key={item.path} item={item} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
