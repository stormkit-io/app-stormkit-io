import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/lab/LoadingButton";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Api from "~/utils/api/Api";
import KeyValue from "~/components/FormV2/KeyValue";
import Card from "~/components/Card";
import CardRow from "~/components/CardRow";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";

const useFetchRuntimes = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [runtimes, setRuntimes] = useState<string[]>();
  const [autoInstall, setAutoInstall] = useState(true);

  useEffect(() => {
    Api.fetch<{ runtimes: string[]; autoInstall: boolean }>(
      "/admin/system/runtimes"
    )
      .then(({ runtimes, autoInstall }) => {
        setRuntimes(runtimes);
        setAutoInstall(autoInstall);
      })
      .catch(() => setError("Something went wrong while fetching runtimes"))
      .finally(() => setLoading(false));
  }, []);

  return { loading, error, runtimes, autoInstall };
};

export const mapRuntimes = (runtimes: string[]): Record<string, string> => {
  const result: Record<string, string> = {};

  runtimes.forEach(runtime => {
    // Find the last @ symbol to split package name from version
    const lastAtIndex = runtime.lastIndexOf("@");

    if (lastAtIndex === -1) {
      // No @ found, treat entire string as package name with undefined version
      result[runtime] = "latest";
    } else {
      // Normal case: split at the last @
      const packageName = runtime.substring(0, lastAtIndex);
      const version = runtime.substring(lastAtIndex + 1);
      result[packageName] = version;
    }
  });

  return result;
};

function Runtimes() {
  const { error, loading, runtimes, autoInstall: auto } = useFetchRuntimes();
  const [updateSuccess, setUpdateSuccess] = useState<string>();
  const [updateError, setUpdateError] = useState<string>();
  const [updateLoading, setUpdateLoading] = useState(false);
  const [kv, setKV] = useState<Record<string, string>>({});
  const [autoInstall, setAutoInstall] = useState(auto);
  const disabled =
    autoInstall === auto &&
    JSON.stringify(kv) === JSON.stringify(mapRuntimes(runtimes || []));

  useEffect(() => {
    setKV(mapRuntimes(runtimes || []));
  }, [runtimes]);

  useEffect(() => {
    setAutoInstall(auto);
  }, [auto]);

  return (
    <Card
      loading={loading}
      error={error || updateError}
      success={updateSuccess}
      sx={{ backgroundColor: "container.transparent" }}
      contentPadding={false}
    >
      <CardHeader
        title="Installed runtimes"
        subtitle="Manage runtimes that are installed on your Stormkit instance."
      />
      <Box sx={{ px: 4 }}>
        <KeyValue
          defaultValue={kv}
          inputName="runtimes"
          keyName="Runtime name"
          valName="Runtime version"
          keyPlaceholder="node"
          valPlaceholder="24"
          modifyAsString={false}
          onChange={newVars => {
            setKV(newVars);
            setUpdateSuccess(undefined);
            setUpdateError(undefined);
          }}
        />
      </Box>
      <Box
        sx={{ bgcolor: "container.transparent", p: 1.75, pt: 1, mb: 4, mx: 4 }}
      >
        <FormControlLabel
          sx={{ pl: 0, ml: 0 }}
          label="Auto install"
          control={
            <Switch
              name="autoInstall"
              color="secondary"
              checked={autoInstall}
              onChange={e => {
                setAutoInstall(e.target.checked);
              }}
            />
          }
          labelPlacement="start"
        />
        <Typography color="text.secondary">
          When enabled, runtimes are automatically installed during deployment
          based on your app's version configuration files.
          <br />
          Check the{" "}
          <Link
            href="https://www.stormkit.io/docs/self-hosting/runtimes"
            color="error"
            target="_blank"
            rel="noopener noreferrer"
          >
            documentation
          </Link>{" "}
          for details.
        </Typography>
      </Box>
      <CardFooter>
        <Button
          variant="contained"
          color="secondary"
          type="submit"
          disabled={disabled}
          loading={updateLoading}
          onClick={() => {
            setUpdateLoading(true);

            Api.post("/admin/system/runtimes", {
              autoInstall,
              runtimes: Object.entries(kv).map(
                ([key, value]) => `${key}@${value}`
              ),
            })
              .then(() => {
                setUpdateSuccess("Runtimes were installed successfully");
              })
              .catch(() => {
                setUpdateError(
                  "An error occurred while installing runtimes. Make sure specified versions are correct."
                );
              })
              .finally(() => {
                setUpdateLoading(false);
              });
          }}
        >
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}

const useFetchMise = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [version, setVersion] = useState<string>();

  useEffect(() => {
    Api.fetch<{ version: string }>("/admin/system/mise")
      .then(({ version }) => {
        setVersion(version);
      })
      .catch(() => setError("Something went wrong while fetching mise version"))
      .finally(() => setLoading(false));
  }, []);

  return { loading, error, version, setVersion };
};

function Mise() {
  const { error, loading, version, setVersion } = useFetchMise();
  const [updateSuccess, setUpdateSuccess] = useState<string>();
  const [updateError, setUpdateError] = useState<string>();
  const [updateLoading, setUpdateLoading] = useState(false);

  return (
    <Card
      loading={loading}
      error={error || updateError}
      sx={{ mt: 4, backgroundColor: "container.transparent" }}
      success={updateSuccess}
      contentPadding={false}
    >
      <CardHeader
        title="Mise"
        subtitle="Stormkit relies on open-source mise for runtime management."
        actions={
          <Button
            variant="contained"
            color="secondary"
            loading={updateLoading}
            onClick={() => {
              setUpdateLoading(true);

              Api.post<{ version: string }>("/admin/system/mise")
                .then(({ version }) => {
                  setUpdateSuccess("Mise was upgraded successfully");
                  setVersion(version);
                })
                .catch(() => {
                  setUpdateError("An error occurred while upgrading mise.");
                })
                .finally(() => {
                  setUpdateLoading(false);
                });
            }}
          >
            Upgrade to latest
          </Button>
        }
      />
      <CardRow>
        <Typography variant="h2" color="text.secondary" sx={{ mb: 0.5 }}>
          Current version
        </Typography>
        <Typography>{version || "Unknown"}</Typography>
      </CardRow>
    </Card>
  );
}

export default function System() {
  return (
    <Box>
      <Runtimes />
      <Mise />
    </Box>
  );
}
