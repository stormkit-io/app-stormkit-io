import { FormEventHandler, useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/lab/LoadingButton";
import Card from "~/components/Card";
import CardFooter from "~/components/CardFooter";
import CardHeader from "~/components/CardHeader";
import { updateTeam } from "./actions";

interface Props {
  team: Team;
  reloadTeams?: () => void;
}

export default function TeamSettings({ team, reloadTeams }: Props) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTeamUpdate: FormEventHandler<HTMLElement> = e => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<
      string,
      string
    >;

    if (!data.name) {
      return setError("Team name is a required field.");
    }

    setIsLoading(true);

    updateTeam({ name: data.name, teamId: team.id })
      .then(t => {
        if (t.slug !== team.slug) {
          navigate(`/${t.id}/settings`, { replace: true });
        }

        reloadTeams?.();
      })
      .catch(e => {
        setError("Something went wrong while updating the team.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Card
      sx={{ mb: 4 }}
      component="form"
      onSubmit={handleTeamUpdate}
      error={error}
    >
      <CardHeader
        title="Team settings"
        subtitle="Only Owners and Admins can update team settings."
      />
      <TextField
        label="Team name"
        variant="filled"
        autoComplete="off"
        defaultValue={team.name}
        fullWidth
        name="name"
        autoFocus
        placeholder="My Awesome Team"
        sx={{ mb: 4 }}
      />
      <CardFooter>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          loading={isLoading}
        >
          Update
        </Button>
      </CardFooter>
    </Card>
  );
}
