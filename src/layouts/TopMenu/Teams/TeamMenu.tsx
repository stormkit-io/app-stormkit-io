import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Add from "@mui/icons-material/Add";
import Check from "@mui/icons-material/Check";
import Settings from "@mui/icons-material/Settings";
import GroupAdd from "@mui/icons-material/GroupAdd";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";

interface Props {
  selectedTeam?: Team;
  teams?: Team[];
  onClickAway: () => void;
  onSettingsClick: (t: Team) => void;
  onCreateTeamButtonClicked: () => void;
}

const PERSONAL_TEAM = "Personal";

export default function TeamMenu({
  selectedTeam,
  teams,
  onSettingsClick,
  onCreateTeamButtonClicked,
  onClickAway,
}: Props) {
  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <Box>
        <Box
          sx={{
            height: "50px",
            borderBottom: "1px solid rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h2" sx={{ opacity: 0.5, flex: 1, pl: 1 }}>
            Teams
          </Typography>
          {selectedTeam &&
            !selectedTeam.isDefault &&
            selectedTeam.currentUserRole !== "developer" && (
              <IconButton aria-label="Team members">
                <Link href={`/${selectedTeam?.slug}/settings`}>
                  <GroupAdd sx={{ fontSize: 16 }} />
                </Link>
              </IconButton>
            )}
        </Box>
        <Box role="list">
          {teams?.map(team => (
            <Box
              key={team.id}
              data-testid={`team-${team.id}`}
              sx={{
                display: "flex",
                alignItems: "center",
                my: 2,
                ":last-child": { mb: 0 },
              }}
            >
              <Check
                sx={{
                  fontSize: 14,
                  mr: 1,
                  cursor: "default",
                  visibility:
                    team.id === selectedTeam?.id ? "visible" : "hidden",
                }}
              />
              <Link
                href={team.isDefault ? "/" : `/${team.slug}`}
                sx={{
                  p: 1,
                  minWidth: "220px",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  ":hover": {
                    bgcolor: "rgba(255,255,255,0.2)",
                    cursor: "pointer",
                    color: "inherit",
                  },
                }}
              >
                <Typography component="span" sx={{ flex: 1 }}>
                  {team.isDefault ? PERSONAL_TEAM : team.name}
                </Typography>
                <Chip
                  label={team.isDefault ? "default" : team.currentUserRole}
                  size="small"
                />
              </Link>
              {!team.isDefault && team.currentUserRole !== "developer" && (
                <IconButton
                  aria-label="Team settings"
                  sx={{ opacity: 0.5, ":hover": { opacity: 1 } }}
                  onClick={() => {
                    onSettingsClick(team);
                  }}
                >
                  <Settings sx={{ fontSize: 14 }} />
                </IconButton>
              )}
            </Box>
          ))}
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={e => {
              e.preventDefault();
              onCreateTeamButtonClicked();
            }}
          >
            <Add sx={{ mr: 0.25, fontSize: 16 }} />
            Create team
          </Button>
        </Box>
      </Box>
    </ClickAwayListener>
  );
}
