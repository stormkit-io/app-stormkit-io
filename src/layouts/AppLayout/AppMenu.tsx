import { useMemo } from "react";
import { useLocation } from "react-router";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import AppName from "~/components/AppName";
import { appMenuItems } from "./menu_items";

interface Props {
  app: App;
}

export default function AppHeader({ app }: Props) {
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
            app={app}
            imageWidth={28} // Same as Stormkit Icon
            withLinkToRepo
            withMarginRight={false}
            wrapOnMobile
          />
        </Box>
        <Box>
          {appMenu.map(item => (
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
          ))}
        </Box>
      </Box>
    </Box>
  );
}
