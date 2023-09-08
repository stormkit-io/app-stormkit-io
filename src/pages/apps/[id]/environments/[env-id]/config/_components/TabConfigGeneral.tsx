import type { AutoDeployValues, FormValues } from "../actions";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import Select from "@mui/material/Select";
import Option from "@mui/material/MenuItem";
import Button from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import InputDesc from "~/components/InputDescription";
import ConfirmModal from "~/components/ConfirmModal";
import {
  updateEnvironment,
  deleteEnvironment,
  buildFormValues,
  computeAutoDeployValue,
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
  const navigate = useNavigate();
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [isLoading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [autoDeploy, setAutoDeploy] = useState<AutoDeployValues>(
    computeAutoDeployValue(env)
  );

  useEffect(() => {
    setAutoDeploy(computeAutoDeployValue(env));
  }, [env?.autoDeployBranches, env?.autoDeploy]);

  if (!env) {
    return <></>;
  }

  return (
    <Box
      component="form"
      sx={{ p: 2, color: "white" }}
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
      <Typography variant="h6">General settings</Typography>
      <Typography variant="subtitle2" sx={{ opacity: 0.5, mb: 4 }}>
        Use these settings to configure your environment details.
      </Typography>
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Environment name"
          name="name"
          fullWidth
          defaultValue={env.name}
          variant="filled"
          autoComplete="off"
        />
      </Box>
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Branch"
          name="branch"
          fullWidth
          defaultValue={env.branch}
          variant="filled"
          autoComplete="off"
        />
      </Box>
      <Box sx={{ bgcolor: "rgba(0,0,0,0.2)", p: 1.75, pt: 1, mb: 4 }}>
        <FormControlLabel
          sx={{ pl: 0, ml: 0 }}
          label="Auto publish"
          control={
            <Switch
              name="autoPublish"
              color="secondary"
              defaultChecked={env.autoPublish}
            />
          }
          labelPlacement="start"
        />
        <Typography sx={{ opacity: 0.5 }}>
          Turn this feature on to automatically publish successful deployments
          on the default branch.
        </Typography>
      </Box>

      <Box sx={{ mb: 4 }}>
        <FormControl variant="standard" fullWidth>
          <InputLabel id="auto-deploy-label" sx={{ pl: 2, pt: 1 }}>
            Auto deploy
          </InputLabel>
          <Select
            labelId="auto-deploy-label"
            name="autoDeploy"
            variant="filled"
            value={autoDeploy}
            fullWidth
            defaultValue="custom"
            onChange={e => {
              setAutoDeploy(e.target.value as AutoDeployValues);
            }}
          >
            <Option value="disabled">Disabled</Option>
            <Option value="all">All branches</Option>
            <Option value="custom">Custom branches</Option>
          </Select>
        </FormControl>
      </Box>

      {autoDeploy === "custom" && (
        <Box sx={{ mb: 4 }}>
          <TextField
            variant="filled"
            name="autoDeployBranches"
            label="Auto deploy branches"
            defaultValue={env?.branch || ""}
            InputProps={{
              endAdornment: <code className="ml-1 text-pink-50">/i</code>,
            }}
            fullWidth
          />
          <InputDesc>
            <Typography sx={{ mb: 2 }}>
              Specify which branches should be automatically deployed to this
              environment. Below are some examples:
            </Typography>
            <Box component="ol">
              <Box component="li" sx={{ mb: 2 }}>
                <Box component="code" sx={{ color: "white" }}>
                  ^(?!dependabot).+
                </Box>{" "}
                <Typography display="block" sx={{ mt: 0.5 }}>
                  Match anything that does not start with <b>dependabot</b>
                </Typography>
              </Box>
              <Box component="li">
                <Box component="code" sx={{ color: "white" }}>
                  ^release-.+
                </Box>
                <Typography display="block" sx={{ mt: 0.5 }}>
                  Match anything that starts with <b>release-</b>
                </Typography>
              </Box>
            </Box>
          </InputDesc>
        </Box>
      )}

      {(error || success) && (
        <Box sx={{ mb: 4 }}>
          <Alert>
            <AlertTitle>{error ? "Error" : "Success"}</AlertTitle>
            <Typography>{success || error}</Typography>
          </Alert>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent:
            env.name === "production" ? "flex-end" : "space-between",
          mb: 2,
        }}
      >
        {env.name !== "production" && (
          <>
            <Button
              type="button"
              variant="contained"
              color="secondary"
              aria-label={`Delete ${env.name} environment`}
              sx={{
                textTransform: "none",
                opacity: 0.6,
                "&:hover": { opacity: 1 },
              }}
              onClick={() => {
                setIsDeleteModalOpen(true);
              }}
            >
              <Box component="span">
                Delete <b>{env.name}</b> environment
              </Box>
            </Button>
            {isDeleteModalOpen && (
              <ConfirmModal
                onCancel={() => {
                  setIsDeleteModalOpen(false);
                }}
                onConfirm={({ setLoading, setError }) => {
                  setLoading(false);

                  deleteEnvironment({ app, environment: env })
                    .then(() => {
                      setLoading(false);
                      navigate(`/apps/${app.id}/environments`);
                      setRefreshToken?.(Date.now());
                    })
                    .catch(e => {
                      console.error(e);
                      setError(
                        "Something went wrong while deleting environment. Check the console."
                      );
                    });
                }}
              >
                <span className="block">
                  This will completely delete the environment and associated
                  deployments.
                </span>
              </ConfirmModal>
            )}
          </>
        )}
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          loading={isLoading}
          sx={{ textTransform: "capitalize" }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}
