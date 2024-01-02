import type { FormValues } from "../actions";
import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/lab/LoadingButton";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
import Spinner from "~/components/Spinner";
import { isFrameworkRecognized } from "../helpers";
import {
  updateEnvironment,
  buildFormValues,
  useFetchRepoMeta,
} from "../actions";

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
  const [root, setRoot] = useState(env?.build?.vars?.["SK_CWD"] || "");
  const { meta, loading: metaLoading } = useFetchRepoMeta({ app, env });

  if (!env) {
    return <></>;
  }

  return (
    <Card
      component="form"
      sx={{ color: "white" }}
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
          defaultValue={env?.build.cmd || ""}
          fullWidth
          name="build.cmd"
          autoFocus
          placeholder="Defaults to 'npm run build' or 'yarn build' or 'pnpm build'"
          helperText={
            <Typography sx={{ mt: 1 }}>
              Concatenate multiple commands with the logical `&&` operator:{" "}
              <Box component="code" sx={{ color: "white" }}>
                npm run test && npm run build
              </Box>
            </Typography>
          }
        />
      </Box>
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Output folder"
          variant="filled"
          autoComplete="off"
          defaultValue={env?.build.distFolder || ""}
          fullWidth
          disabled={metaLoading || isFrameworkRecognized(meta?.framework)}
          name="build.distFolder"
          InputProps={{
            endAdornment: metaLoading && <Spinner width={4} height={4} />,
          }}
          placeholder={
            !metaLoading && !isFrameworkRecognized(meta?.framework)
              ? "Output folder is not needed. It is taken from the framework configuration file."
              : "Defaults to `build`, `dist`, `output` or `.stormkit`"
          }
          helperText={
            !metaLoading &&
            !isFrameworkRecognized(meta?.framework) && (
              <Typography sx={{ mt: 1 }}>
                The output folder will be uploaded to our CDN and Functions.
                This path is relative to your repository root folder.
              </Typography>
            )
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
          placeholder="Defaults to `/`"
          helperText={
            <Typography sx={{ mt: 1 }}>
              The build root specifies the working directory. Build command and
              output folder will be relative to this path.
            </Typography>
          }
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
