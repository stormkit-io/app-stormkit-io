import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
import { useSubmitHandler } from "../actions";

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
        title="Serverless functions"
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
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          placeholder="/api"
          sx={{ mb: 4 }}
          helperText={`The path to the \`api\` folder where your serverless functions reside.`}
        />

        <TextField
          label="API path prefix"
          variant="filled"
          autoComplete="off"
          defaultValue={env?.build.apiPathPrefix || "/api"}
          name="build.apiPathPrefix"
          fullWidth
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          placeholder="/api"
          helperText={"The URL prefix for accessing your serverless functions."}
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
