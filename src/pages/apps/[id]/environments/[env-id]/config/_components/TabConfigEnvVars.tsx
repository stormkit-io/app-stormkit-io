import type { FormValues } from "../actions";
import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/lab/LoadingButton";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
import KeyValue from "~/components/FormV2/KeyValue";
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
  const [vars, setVars] = useState<Record<string, string>>(
    env.build.vars || {}
  );

  if (!env) {
    return <></>;
  }

  const defaultValue = useMemo(() => {
    return JSON.parse(
      JSON.stringify(
        env?.build?.vars || (env ? {} : { NODE_ENV: "development" })
      )
    );
  }, [env.build.vars]);

  // Remove special variables
  delete defaultValue.SK_CWD;

  return (
    <Card
      id="env-vars"
      component="form"
      sx={{ color: "white", mb: 2 }}
      error={error}
      success={success}
      onSubmit={e => {
        e.preventDefault();

        const values: FormValues = buildFormValues(
          { ...env, build: { ...env.build, vars } },
          e.target as HTMLFormElement
        );

        const root = env.build?.vars?.["SK_CWD"];

        if (root) {
          values["build.vars"] = `${values["build.vars"]}\nSK_CWD=${root}`;
        }

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
        title="Environment variables"
        subtitle="These variables will be available to build time and Functions runtime."
      />
      <Box sx={{ mb: 2 }}>
        <KeyValue
          inputName="build.vars"
          keyName="Name"
          valName="Value"
          keyPlaceholder="NODE_ENV"
          valPlaceholder="production"
          onChange={newVars => {
            setVars(newVars);
          }}
          onModalOpen={() => {
            setSuccess("");
            setError("");
          }}
          defaultValue={defaultValue}
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
