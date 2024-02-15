import type { FormValues } from "../actions";
import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/lab/LoadingButton";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
import { updateEnvironment, buildFormValues } from "../actions";

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
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [isLoading, setLoading] = useState(false);

  if (!env) {
    return <></>;
  }

  return (
    <Card
      id="redirects"
      component="form"
      sx={{ color: "white", mb: 2 }}
      error={error}
      success={success}
      onSubmit={e => {
        e.preventDefault();

        const values: FormValues = buildFormValues(
          env,
          e.target as HTMLFormElement
        );

        updateEnvironment({
          app,
          envId: env.id!,
          values,
          setError,
          setLoading,
          setSuccess,
          setRefreshToken,
        });
      }}
    >
      <CardHeader
        title="Redirects"
        subtitle="Configure redirects and path rewrites for your application."
      />
      <Box>
        <TextField
          label="Redirects file location"
          variant="filled"
          autoComplete="off"
          defaultValue={env?.build.redirectsFile || ""}
          name="build.redirectsFile"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="./_redirects"
          helperText={
            "The relative path to the `redirects` file from the build root."
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
