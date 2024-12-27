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
  const [root, setRoot] = useState(env?.build?.vars?.["SK_CWD"] || "./");

  if (!env) {
    return <></>;
  }

  return (
    <Card
      id="build"
      component="form"
      sx={{ mb: 2 }}
      error={error}
      success={success}
      onSubmit={e => {
        e.preventDefault();

        if (!env.build.vars) {
          env.build.vars = {};
        }

        env.build.vars["SK_CWD"] = root;

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
        title="Build settings"
        subtitle="Use these settings to configure your build options."
      />
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Build command"
          variant="filled"
          autoComplete="off"
          defaultValue={env?.build.buildCmd || ""}
          fullWidth
          name="build.buildCmd"
          placeholder="Defaults to 'npm run build' or 'yarn build' or 'pnpm build'"
          helperText={
            <>
              Concatenate multiple commands:{" "}
              <Box component="code" sx={{ fontSize: 11, px: 0.5, py: 0.25 }}>
                npm run test && npm run build
              </Box>
            </>
          }
        />
      </Box>
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Output folder"
          variant="filled"
          autoComplete="off"
          defaultValue={
            env?.build.distFolder || env?.build.serverFolder || "./"
          }
          fullWidth
          name="build.distFolder"
          placeholder="Defaults to `build`, `dist`, `output` or `.stormkit`"
          helperText={
            <>
              The folder containing your built assets. For many projects, this
              is either{" "}
              <Box component="code" sx={{ fontSize: 11, px: 0.5, py: 0.25 }}>
                dist
              </Box>{" "}
              <Box component="code" sx={{ fontSize: 11, px: 0.5, py: 0.25 }}>
                build
              </Box>{" "}
              <Box component="code" sx={{ fontSize: 11, px: 0.5, py: 0.25 }}>
                output
              </Box>
              .
            </>
          }
        />
      </Box>
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Build root"
          variant="filled"
          autoComplete="off"
          value={root}
          onChange={e => {
            setRoot(e.target.value);
          }}
          fullWidth
          placeholder="Defaults to `./`"
          helperText={"The working directory relative to the Repository root."}
        />
      </Box>

      <CardFooter>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          loading={isLoading}
          sx={{ textTransform: "capitalize" }}
        >
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}
