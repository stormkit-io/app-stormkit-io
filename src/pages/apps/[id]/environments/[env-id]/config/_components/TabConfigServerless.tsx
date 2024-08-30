import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
import { isSelfHosted } from "~/utils/helpers/instance";
import { useSubmitHandler } from "../actions";

const selfHosted = isSelfHosted();

interface Props {
  app: App;
  environment: Environment;
  setRefreshToken: (v: number) => void;
}

export default function TabConfigGeneral({
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
      id="serverless"
      component="form"
      sx={{ mb: 2 }}
      error={error}
      success={success}
      onSubmit={submitHandler}
    >
      <CardHeader
        title="Serverless"
        subtitle="Configure your application's serverless settings."
      />
      <Box sx={{ mb: 4 }}>
        <TextField
          label="API folder"
          variant="filled"
          autoComplete="off"
          defaultValue={env?.build.apiFolder || "/api"}
          name="build.apiFolder"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="/api"
          helperText={`The path to the \`api\` folder where your serverless functions reside. The request path for the API functions will match the same name.`}
        />
      </Box>

      {selfHosted && (
        <Box sx={{ mb: 4 }}>
          <Alert color="info" sx={{ mb: 4 }}>
            <AlertTitle>Experimental Feature</AlertTitle>
            <Typography>
              Server Command is only available to local deployments. If you are
              using an external service such as GitHub Actions for your
              deployments, you may want to use Serverless Functions instead.
            </Typography>
          </Alert>

          <TextField
            label="Run command"
            variant="filled"
            autoComplete="off"
            defaultValue={env?.build.serverCmd || ""}
            name="build.serverCmd"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="node index.js"
            helperText={
              "The command to run your Node.js application. Leave empty if you don't have any."
            }
            sx={{ mb: 4 }}
          />

          <TextField
            label="Server folder"
            variant="filled"
            autoComplete="off"
            defaultValue={env?.build.serverFolder || ""}
            name="build.serverFolder"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            placeholder=""
            helperText={"The for where the server side application is located."}
          />
        </Box>
      )}

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
