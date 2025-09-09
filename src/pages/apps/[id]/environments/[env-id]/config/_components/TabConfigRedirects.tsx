import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import { grey } from "@mui/material/colors";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
import { useSubmitHandler } from "../actions";
import RedirectsPlaygroundModal from "./RedirectsPlaygroundModal";
import RedirectsEditor from "./Editor";

interface Props {
  app: App;
  environment: Environment;
  setRefreshToken: (v: number) => void;
}

const defaultRedirects = `[

]`;

export default function TabConfigRedirects({
  environment: env,
  app,
  setRefreshToken,
}: Props) {
  const hasRedirects = Boolean(env.build.redirects);
  const initialRedirects =
    JSON.stringify(env.build.redirects, null, 2) || defaultRedirects;

  const [showModal, setShowModal] = useState(false);
  const [showRedirects, setShowRedirects] = useState(hasRedirects);
  const [redirects, setRedirects] = useState(initialRedirects);

  const { submitHandler, error, success, isLoading } = useSubmitHandler({
    app,
    env,
    setRefreshToken,
    controlled: {
      "build.redirects": showRedirects ? redirects : undefined,
    },
  });

  if (!env) {
    return <></>;
  }

  return (
    <Card
      id="redirects"
      component="form"
      sx={{ mb: 2 }}
      error={error}
      success={success}
      onSubmit={submitHandler}
    >
      <CardHeader
        title="Redirects"
        subtitle="Configure redirects and path rewrites for your application."
        actions={
          <Button variant="text" onClick={() => setShowModal(true)}>
            Playground
          </Button>
        }
      />
      <Box sx={{ mb: 4 }}>
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
          helperText={"The path to the `redirects` file from the build root."}
        />
      </Box>
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Custom error file"
          variant="filled"
          autoComplete="off"
          defaultValue={env?.build.errorFile || ""}
          name="build.errorFile"
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          placeholder="/404.html"
          helperText={
            "The error file displayed when Stormkit does not find a page. Default is 404.html."
          }
        />
      </Box>
      <Box sx={{ bgcolor: "container.paper", p: 1.75, pt: 1, mb: 4 }}>
        <FormControlLabel
          sx={{ pl: 0, ml: 0 }}
          label="Overwrite redirects"
          control={
            <Switch
              color="secondary"
              checked={showRedirects}
              onChange={() => {
                setShowRedirects(!showRedirects);
              }}
            />
          }
          labelPlacement="start"
        />
        <Typography sx={{ color: "text.secondary" }}>
          Turn on to overwrite redirects. These redirects will apply immediately
          to all deployments and will take precedence over redirects file.
        </Typography>
      </Box>
      {showRedirects && (
        <Box
          sx={{
            mb: 4,
            p: 2,
            bgcolor: "container.paper",
            borderBottom: `1px solid ${grey[900]}`,
          }}
        >
          <Typography sx={{ mb: 2, color: "text.secondary" }}>
            Redirects
          </Typography>
          <RedirectsEditor
            value={redirects}
            onChange={setRedirects}
            docsLink="https://www.stormkit.io/docs/features/redirects-and-path-rewrites"
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
      {showModal && (
        <RedirectsPlaygroundModal
          env={env}
          appId={app.id}
          onClose={() => {
            setShowModal(false);
          }}
        />
      )}
    </Card>
  );
}
