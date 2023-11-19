import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Add from "@mui/icons-material/Add";
import Check from "@mui/icons-material/Check";
import SwitchRight from "@mui/icons-material/SwitchRight";
import SwitchLeft from "@mui/icons-material/SwitchLeft";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { useFetchTeams } from "./actions";

const PERSONAL_TEAM = "Personal Team";

export default function TeamsToggle() {
  const { teams, loading } = useFetchTeams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const selectedTeam = useMemo(() => {
    return teams?.find(t => t.name === "") || teams?.find(t => t.isDefault);
  }, [teams]);

  const Switch = isMenuOpen ? SwitchRight : SwitchLeft;

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Typography sx={{ color: "white" }}>
        {loading
          ? "Loading"
          : selectedTeam?.isDefault
          ? PERSONAL_TEAM
          : selectedTeam?.name}
      </Typography>
      <Tooltip
        arrow
        open={isMenuOpen}
        placement="bottom"
        title={
          <Box sx={{ p: 1 }}>
            <Typography
              variant="h2"
              sx={{
                opacity: 0.5,
                mb: 1,
                pb: 1,
                pl: 1,
                borderBottom: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              Teams
            </Typography>
            <Box>
              {teams?.map(team => (
                <Box
                  key={team.id}
                  sx={{
                    mb: 1,
                    py: 1,
                    pl: 1,
                    minWidth: "220px",
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    ":last-child": { mb: 0 },
                    ":hover": {
                      bgcolor: "rgba(255,255,255,0.2)",
                      cursor: "pointer",
                    },
                  }}
                >
                  <Typography sx={{ flex: 1 }}>
                    {team.isDefault ? PERSONAL_TEAM : team.name}
                  </Typography>
                  <Chip
                    label={team.isDefault ? "default" : team.currentUserRole}
                    size="small"
                  />
                </Box>
              ))}
              <Button variant="contained" color="secondary" fullWidth>
                <Add sx={{ mr: 0.25, fontSize: 16 }} />
                Create team
              </Button>
            </Box>
          </Box>
        }
      >
        <IconButton
          sx={{ transform: "rotate(90deg)", ml: 0.5 }}
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
          }}
        >
          <Switch sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
