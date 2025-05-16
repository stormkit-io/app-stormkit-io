import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/lab/LoadingButton";
import Api from "~/utils/api/Api";
import KeyValue from "~/components/FormV2/KeyValue";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";

const useFetchRuntimes = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [runtimes, setRuntimes] = useState<string[]>();

  useEffect(() => {
    Api.fetch<{ runtimes: string[] }>("/admin/system/runtimes")
      .then(({ runtimes }) => setRuntimes(runtimes))
      .catch(() => setError("Something went wrong while fetching runtimes"))
      .finally(() => setLoading(false));
  }, []);

  return { loading, error, runtimes };
};

const mapRuntimes = (runtimes: string[]): Record<string, string> => {
  const map: Record<string, string> = {};

  runtimes.forEach(runtime => {
    const [name, version] = runtime.split("@");
    map[name] = version || "latest";
  });

  return map;
};

export default function System() {
  const { error, loading, runtimes } = useFetchRuntimes();
  const [updateSuccess, setUpdateSuccess] = useState<string>();
  const [updateError, setUpdateError] = useState<string>();
  const [updateLoading, setUpdateLoading] = useState(false);
  const [kv, setKV] = useState<Record<string, string>>({});

  useEffect(() => {
    setKV(mapRuntimes(runtimes || []));
  }, [runtimes]);

  return (
    <Card
      loading={loading}
      error={error || updateError}
      success={updateSuccess}
      sx={{ backgroundColor: "container.transparent" }}
      contentPadding={false}
    >
      <CardHeader
        title="Runtimes installed"
        subtitle="Information about your runtimes installed on your Stormkit"
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
      <CardFooter>
        <Button
          variant="contained"
          color="secondary"
          type="submit"
          loading={updateLoading}
          onClick={() => {
            setUpdateLoading(true);

            Api.post("/admin/system/runtimes", {
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
