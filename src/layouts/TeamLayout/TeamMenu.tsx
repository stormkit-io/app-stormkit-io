import { useMemo, useContext } from "react";
import { useLocation } from "react-router";
import Box from "@mui/material/Box";
import { grey } from "@mui/material/colors";
import { AuthContext } from "~/pages/auth/Auth.context";
import MenuLink from "~/components/MenuLink";
import { useSelectedTeam } from "../TopMenu/Teams/actions";

interface Props {
  team?: Team;
}

interface Path {
  path: string;
  icon?: React.ReactNode;
  text: React.ReactNode;
  isActive?: boolean;
}

const teamMenuItems = ({
  team,
  pathname,
}: {
  team: Team;
  pathname: string;
}): Path[] => [
  {
    path: `/${team.slug}/settings`,
    text: "Settings",
    isActive: pathname.includes("/settings"),
  },
  {
    path: `/${team.slug}/audit`,
    text: "Audit logs",
    isActive: pathname.includes("/audit"),
  },
];

export default function TeamMenu({ team }: Props) {
  const { pathname } = useLocation();
  const { teams } = useContext(AuthContext);
  const selectedTeam = useSelectedTeam({ teams });

  const teamMenu = useMemo(() => {
    if (selectedTeam) {
      return teamMenuItems({ team: selectedTeam, pathname });
    }

    return [];
  }, [selectedTeam, pathname]);

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
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <MenuLink
            sx={{
              mr: 1,
              px: { xs: 1, md: 1 },
              pr: { xs: 1, md: 2 },
              bgcolor: "rgba(255,255,255,0.05)",
              color: grey[400],
            }}
            item={{
              text: team?.isDefault ? "My apps" : `${team?.name} Team Apps`,
              path: `/${team?.slug || ""}`,
            }}
          />
        </Box>
        <Box>
          {teamMenu.map(item => (
            <MenuLink key={item.path} item={item} sx={{ mr: 1 }} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
