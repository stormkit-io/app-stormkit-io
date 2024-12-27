import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/lab/LoadingButton";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
import { useSubmitHandler } from "../actions";

interface Props {
  app: App;
  environment: Environment;
  setRefreshToken: (v: number) => void;
}

export default function TabConfigServer({
  environment: env,
  app,
  setRefreshToken,
}: Props) {
  const { error, success, isLoading, submitHandler } = useSubmitHandler({
    env,
    app,
    setRefreshToken,
  });

  if (!env) {
    return <></>;
  }

  return (
    <Card
      id="server"
      component="form"
      sx={{ mb: 2 }}
      error={error}
      success={success}
      onSubmit={submitHandler}
    >
      <CardHeader
        title="Server settings"
        subtitle="Configure your long-running processes."
      />
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Start command"
          variant="filled"
          autoComplete="off"
          defaultValue={env?.build.serverCmd || ""}
          name="build.serverCmd"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="npm run start"
          helperText={
            "The command to run your server application. Leave empty if you don't have any."
          }
          sx={{ mb: 4 }}
        />
      </Box>

      <CardFooter>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          loading={isLoading}
        >
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}
