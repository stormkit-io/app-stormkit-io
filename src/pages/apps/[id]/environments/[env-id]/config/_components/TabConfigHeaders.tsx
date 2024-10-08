import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
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
  const { submitHandler, error, success, isLoading } = useSubmitHandler({
    app,
    env,
    setRefreshToken,
  });

  if (!env) {
    return <></>;
  }

  return (
    <Card
      id="headers"
      component="form"
      sx={{ mb: 2 }}
      error={error}
      success={success}
      onSubmit={submitHandler}
    >
      <CardHeader
        title="Headers"
        subtitle="Configure your application's headers for static files."
      />
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Headers file location"
          variant="filled"
          autoComplete="off"
          defaultValue={env?.build.headersFile || ""}
          name="build.headersFile"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="./_headers"
          helperText={
            <>
              The path to the `headers` file from the build root.
              <Link
                href="https://stormkit.io/docs/features/custom-headers"
                target="_blank"
                rel="noreferrer noopener"
                sx={{ ml: 0.5, fontSize: "inherit" }}
              >
                Read more.
              </Link>
            </>
          }
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
