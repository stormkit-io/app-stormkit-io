import { useMemo, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import SwitchRight from "@mui/icons-material/SwitchRight";
import SwitchLeft from "@mui/icons-material/SwitchLeft";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { AuthContext } from "~/pages/auth/Auth.context";
import TeamModal from "./TeamModal";
import TeamMenu from "./TeamMenu";

const PERSONAL_TEAM = "Personal";

interface Props {
  app?: App;
}

export default function TeamsToggle({ app }: Props) {
  const { teams, reloadTeams } = useContext(AuthContext);
  const params = useParams();
  const [teamToBeModified, setTeamToBeModified] = useState<Team>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedTeam = useMemo(() => {
    return (
      teams?.find(t => t.slug === params.team || app?.teamId === t.id) ||
      teams?.find(t => t.isDefault)
    );
  }, [teams, params, app]);

  const Switch = isMenuOpen ? SwitchRight : SwitchLeft;

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Tooltip
        arrow
        open={isMenuOpen}
        placement="bottom-start"
        PopperProps={{
          modifiers: [{ name: "offset", options: { offset: [0, 12] } }],
        }}
        title={
          <Box sx={{ p: 1 }}>
            <TeamMenu
              selectedTeam={selectedTeam}
              teams={teams}
              onClickAway={() => {
                setIsMenuOpen(false);
              }}
              onSettingsClick={team => {
                setTeamToBeModified(team);
                setIsModalOpen(true);
                setIsMenuOpen(false);
              }}
              onCreateTeamButtonClicked={() => {
                setIsModalOpen(true);
                setIsMenuOpen(false);
              }}
            />
          </Box>
        }
      >
        <Box>
          <Button
            variant="text"
            type="button"
            sx={{ color: "white" }}
            onClick={e => {
              e.preventDefault();
              setIsMenuOpen(!isMenuOpen);
            }}
          >
            {selectedTeam?.isDefault ? PERSONAL_TEAM : selectedTeam?.name}
            <Switch sx={{ transform: "rotate(90deg)", ml: 1, fontSize: 16 }} />
          </Button>
        </Box>
      </Tooltip>

      {isModalOpen && (
        <TeamModal
          team={teamToBeModified}
          reload={reloadTeams}
          onClose={() => {
            setIsModalOpen(false);
            setTeamToBeModified(undefined);
          }}
        />
      )}
    </Box>
  );
}
