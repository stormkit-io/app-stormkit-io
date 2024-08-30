import React, { useState } from "react";
import { useNavigate } from "react-router";
import { deploy } from "~/pages/apps/actions";
import { useFetchRepoMeta } from "~/pages/apps/[id]/environments/[env-id]/config/actions";
import { isFrameworkRecognized } from "~/pages/apps/[id]/environments/[env-id]/config/helpers";
import Box from "@mui/material/Box";
import Button from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Modal from "~/components/Modal";
import EnvironmentSelector from "~/components/EnvironmentSelector";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
import Link from "~/components/Link";
import Spinner from "~/components/Spinner";

interface Props {
  app: App;
  selected?: Environment;
  environments: Array<Environment>;
  toggleModal: (val: boolean) => void;
}

const DeployModal: React.FC<Props> = ({
  toggleModal,
  environments,
  selected: environment,
  app,
}): React.ReactElement => {
  const navigate = useNavigate();
  const [selectedEnv, setSelectedEnv] = useState<Environment | undefined>(
    environment
  );
  const fetchResult = useFetchRepoMeta({ app, env: selectedEnv });
  const [cmd, setCmd] = useState(environment?.build?.buildCmd || "");
  const [dist, setDist] = useState(environment?.build?.distFolder || "");
  const [branch, setBranch] = useState(environment?.branch || "");
  const [error, setError] = useState<null | string>(null);
  const [isAutoPublish, setIsAutoPublish] = useState<boolean>(
    environment?.autoPublish || false
  );
  const [loading, setLoading] = useState<boolean>(false);
  const { meta, loading: metaLoading } = fetchResult;

  const clearForm = () => {
    setCmd("");
    setDist("");
    setBranch("");
    setSelectedEnv(undefined);
    setIsAutoPublish(false);
  };

  return (
    <Modal
      open
      onClose={() => {
        clearForm();
        toggleModal(false);
      }}
    >
      <Card
        component="form"
        error={
          error === "repo-not-found" ? (
            <Typography component="div">
              Repository is inaccessible. See the{" "}
              <Link
                className="font-bold hover:text-white hover:underline"
                to="https://www.stormkit.io/docs/other/troubleshooting#repository-is-innaccessible"
              >
                troubleshooting
              </Link>{" "}
              for help.
            </Typography>
          ) : (
            error && <Typography component="div">{error}</Typography>
          )
        }
        onSubmit={e => {
          e.preventDefault();

          deploy({
            app,
            environment: selectedEnv,
            setError,
            setLoading,
            config: {
              branch,
              buildCmd: cmd,
              distFolder: dist,
              publish: isAutoPublish || false,
            },
          }).then(deploy => {
            if (deploy) {
              toggleModal(false);
              navigate(
                `/apps/${app.id}/environments/${selectedEnv?.id}/deployments/${deploy.id}`
              );
            }
          });
        }}
      >
        <CardHeader title="Start a deployment" />
        <Box sx={{ mb: 4 }}>
          <EnvironmentSelector
            placeholder="Select an environment to deploy"
            environments={environments}
            defaultValue={environment?.id || ""}
            onSelect={(env: Environment): void => {
              if (env) {
                setBranch(env.branch);
                setCmd(env.build.buildCmd || "");
                setDist(env.build.distFolder);
                setIsAutoPublish(env.autoPublish);
                setError(null);
                setSelectedEnv(env);
              } else {
                clearForm();
              }
            }}
          />
        </Box>
        <Box sx={{ mb: 4 }}>
          <TextField
            name="branch"
            variant="filled"
            label="Checkout branch"
            value={branch}
            onChange={e => {
              setBranch(e.target.value);
            }}
            inputProps={{
              "aria-label": "Branch to deploy",
            }}
            fullWidth
          />
        </Box>
        <Box sx={{ mb: 4 }}>
          <TextField
            value={cmd}
            variant="filled"
            label="Build command"
            fullWidth
            name="build.buildCmd"
            onChange={e => setCmd(e.target.value)}
            placeholder="Defaults to 'npm run build' or 'yarn build' or 'pnpm build'"
            helperText="Concatenate multiple commands with the logical `&&` operator (e.g. npm run test && npm run build)"
          />
        </Box>
        <Box sx={{ mb: 4 }}>
          {!metaLoading && isFrameworkRecognized(meta?.framework) ? (
            <Box sx={{ cursor: "not-allowed" }}>
              <span className="fa fa-info-circle mr-2 ml-1" />
              Output folder read from framework configuration file.
            </Box>
          ) : (
            <TextField
              value={dist}
              variant="filled"
              label="Output folder"
              fullWidth
              name="build.distFolder"
              onChange={e => setDist(e.target.value)}
              placeholder="Defaults to `build`, `dist`, `output` or `.stormkit`"
              helperText="The folder where the build artifacts are located"
              InputProps={{
                endAdornment: metaLoading && <Spinner width={4} height={4} />,
              }}
            />
          )}
        </Box>
        <Box sx={{ bgcolor: "container.paper", p: 1.75, pt: 1, mb: 4 }}>
          <FormControlLabel
            sx={{ pl: 0, ml: 0 }}
            label="Auto publish"
            control={
              <Switch
                name="autoPublish"
                color="secondary"
                checked={isAutoPublish}
                onChange={e => {
                  setIsAutoPublish(e.target.checked);
                }}
              />
            }
            labelPlacement="start"
          />
          <Typography sx={{ color: "text.secondary" }}>
            When enabled successful deployments will be published automatically
          </Typography>
        </Box>
        <CardFooter sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            href={`/apps/${app.id}/environments/${selectedEnv?.id}`}
            onClick={() => {
              toggleModal(false);
            }}
          >
            <span className="fas fa-wrench mr-3" />
            Update default settings
          </Button>
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            loading={loading}
          >
            Deploy now
          </Button>
        </CardFooter>
      </Card>
    </Modal>
  );
};

export default DeployModal;
