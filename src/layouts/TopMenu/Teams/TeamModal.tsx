import { useState } from "react";
import { useNavigate } from "react-router";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/lab/LoadingButton";
import GroupAdd from "@mui/icons-material/GroupAdd";
import Modal from "~/components/ModalV2";
import { upsertTeam } from "./actions";

interface Props {
  team?: Team;
  reload?: () => void;
  onClose: () => void;
}

export default function TeamModal({ team, onClose, reload }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  return (
    <Modal open maxWidth="500px" onClose={onClose}>
      <Box sx={{ p: 4 }}>
        <Box sx={{ mb: 4, display: "flex", alignItems: "flex-start" }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">{team ? "Update" : "New"} Team</Typography>
            <Typography variant="subtitle2" sx={{ opacity: 0.5 }}>
              Use teams to collaborate with other team members.
            </Typography>
          </Box>
          {team?.id && (
            <IconButton>
              <GroupAdd sx={{ fontSize: 16 }} />
            </IconButton>
          )}
        </Box>
        <Box
          component="form"
          onSubmit={e => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const data = Object.fromEntries(
              new FormData(form).entries()
            ) as Record<string, string>;

            if (!data.name) {
              return setError("Team name is a required field.");
            }

            setIsLoading(true);

            upsertTeam({ name: data.name, teamId: team?.id })
              .then(t => {
                reload?.();
                onClose();
                navigate(`/${t.slug}`, { replace: true });
              })
              .catch(e => {
                setError("Something went wrong while saving the team.");
              })
              .finally(() => {
                setIsLoading(false);
              });
          }}
        >
          <TextField
            label="Team name"
            variant="filled"
            autoComplete="off"
            defaultValue={team?.name || ""}
            fullWidth
            name="name"
            autoFocus
            placeholder="My Awesome Team"
            sx={{ mb: 4 }}
          />
          {error && (
            <Alert color="error" sx={{ mb: 4 }}>
              <AlertTitle>Error</AlertTitle>
              <Typography>{error}</Typography>
            </Alert>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: team ? "space-between" : "flex-end",
            }}
          >
            {team && (
              <Button type="button" variant="outlined" color="info">
                Delete
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              loading={isLoading}
            >
              {team ? "Update" : "Create"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
