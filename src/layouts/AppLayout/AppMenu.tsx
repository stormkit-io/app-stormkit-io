import { useMemo } from "react";
import { useLocation } from "react-router";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
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
        px: 2.5,
        borderBottom: "1px solid rgba(255,255,255,0.3)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box sx={{ mr: 1 }}>
          <AppName
            app={app}
            imageWidth={23} // Same as Stormkit Icon
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
                borderBottomWidth: "2px",
                borderBottomStyle: "solid",
                borderBottomColor: item.isActive ? "#ffa500b3" : "transparent",
                color: "white",
                pr: { xs: 0, md: 2 },
                py: { xs: 1.25, md: 0 },
                display: "inline-flex",
                alignItems: "center",
                position: "relative",
                bottom: "-1px",
                ":hover": { opacity: 1, color: "white" },
              }}
            >
              <Box
                component="span"
                sx={{
                  scale: "0.75",
                  display: { xs: "none", md: "inline-block" },
                }}
              >
                <IconButton>{item.icon}</IconButton>
              </Box>
              {item.text}
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
