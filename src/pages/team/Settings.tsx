import { useContext } from "react";
import Box from "@mui/material/Box";
import Error404 from "~/components/Errors/Error404";
import { AuthContext } from "~/pages/auth/Auth.context";
import { useSelectedTeam } from "~/layouts/TopMenu/Teams/actions";
import TeamMembers from "./TeamMembers";
import TeamDelete from "./TeamDelete";
import TeamAPIKeys from "./TeamAPIKeys";
import TeamSettings from "./TeamSettings";

export default function Settings() {
  const { user, teams, reloadTeams } = useContext(AuthContext);
  const team = useSelectedTeam({ teams });

  if (!team || team.isDefault || !teams) {
    return <Error404 />;
  }

  return (
    <Box sx={{ color: "white", width: "100%" }} maxWidth="md">
      <TeamSettings team={team} reloadTeams={reloadTeams} />
      <TeamMembers user={user!} reloadTeams={reloadTeams} team={team} />
      <TeamAPIKeys team={team} />
      <TeamDelete reloadTeams={reloadTeams} team={team} />
    </Box>
  );
}
