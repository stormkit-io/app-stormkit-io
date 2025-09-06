import { useState } from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Button from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { grey } from "@mui/material/colors";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
import HeadersEditor from "./Editor";
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
  const [headers, setHeaders] = useState(env.build.headers);
  const [showHeaders, setShowHeaders] = useState(Boolean(env.build.headers));

  const { submitHandler, error, success, isLoading } = useSubmitHandler({
    app,
    env,
    setRefreshToken,
    controlled: {
      "build.headers": showHeaders ? headers : undefined,
    },
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
          slotProps={{
            inputLabel: {
              shrink: true,
            },
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
      <Box sx={{ bgcolor: "container.paper", p: 1.75, pt: 1, mb: 4 }}>
        <FormControlLabel
          sx={{ pl: 0, ml: 0 }}
          label="Overwrite headers"
          control={
            <Switch
              color="secondary"
              checked={showHeaders}
              onChange={() => {
                setShowHeaders(!showHeaders);
              }}
            />
          }
          labelPlacement="start"
        />
        <Typography sx={{ color: "text.secondary" }}>
          Turn on to overwrite headers. These headers will apply immediately to
          all deployments and will take precedence over headers file.
        </Typography>
      </Box>
      {showHeaders && (
        <Box
          sx={{
            mb: 4,
            p: 2,
            bgcolor: "container.paper",
            borderBottom: `1px solid ${grey[900]}`,
          }}
        >
          <Typography sx={{ mb: 2, color: "text.secondary" }}>
            Headers
          </Typography>
          <HeadersEditor
            value={headers}
            onChange={setHeaders}
            docsLink="https://www.stormkit.io/docs/features/custom-headers"
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
