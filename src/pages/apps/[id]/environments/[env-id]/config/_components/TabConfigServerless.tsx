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
      sx={{ color: "white", mb: 2 }}
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
          defaultValue={env?.build.apiFolder || "./api"}
          name="build.apiFolder"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="./api"
          helperText={`The relative path to the \`api\` folder where your serverless
              functions reside. This path is relative to the repository root.`}
        />
      </Box>
      <Box sx={{ mb: 4 }}>
        <TextField
          label="API path prefix"
          variant="filled"
          autoComplete="off"
          defaultValue={env?.build.apiPathPrefix || "/api"}
          name="build.apiPathPrefix"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="/api"
          helperText={`Path prefix for API endpoints. Default is \`/api\`.`}
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
