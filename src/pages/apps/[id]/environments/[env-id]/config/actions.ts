import { useEffect, useState } from "react";
import api from "~/utils/api/Api";

export const computeAutoDeployValue = (env?: Environment): AutoDeployValues => {
  if (!env) {
    return "all";
  }

  return env?.autoDeploy
    ? !env?.autoDeployBranches
      ? "all"
      : "custom"
    : "disabled";
};

export const prepareBuildObject = (values: FormValues): BuildConfig => {
  const vars: Record<string, string> = {};

  values["build.vars"]?.split("\n").forEach(line => {
    if (line.indexOf("=") > 0) {
      const [key, value] = line.split("=");
      vars[key.trim()] = value.trim();
    }
  });

  const build: BuildConfig = {
    cmd: values["build.cmd"]?.trim() || "",
    distFolder: (values["build.distFolder"] || "").trim(),
    vars,
  };

  return build;
};

export const buildFormValues = (
  env: Environment,
  form: HTMLFormElement
): FormValues => {
  return {
    name: env.name,
    branch: env.branch,
    autoDeploy: computeAutoDeployValue(env),
    autoDeployBranches: env.autoDeployBranches,
    "build.cmd": env.build.cmd,
    "build.distFolder": env.build.distFolder,
    "build.vars": Object.keys(env.build?.vars || {})
      .filter(key => env.build.vars[key])
      .map(key => `${key}=${env.build.vars[key]}`)
      .join("\n"),
    ...Object.fromEntries(new FormData(form).entries()),
  };
};

interface FetchRepoMetaProps {
  app: App;
  env?: Environment;
}

interface FetchRepoMetaReturnValue {
  loading: boolean;
  meta?: Meta;
  error?: string;
}

interface Meta {
  packageJson: { scripts: Record<string, string> };
  framework: "angular" | "nuxt" | "next" | "angular";
  frameworkVersion: string;
}

export const useFetchRepoMeta = ({
  env,
  app,
}: FetchRepoMetaProps): FetchRepoMetaReturnValue => {
  const [meta, setMeta] = useState<Meta>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!env) {
      setLoading(false);
      return;
    }

    setLoading(true);

    api
      .fetch<Meta>(`/app/${app.id}/envs/${env.name}/meta`)
      .then(meta => {
        setMeta(meta);
      })
      .catch(async res => {
        try {
          const json = await res.json();

          if (res.status === 403) {
            setError("403");
          } else if (json.code === "branch-not-found") {
            setError(
              "We can't seem to access this branch. Make sure it's spelled correctly."
            );
          } else if (res.status === 503) {
            setError(
              "We cannot fetch repository information. Please check your internet connection."
            );
          }
        } catch {
          setError("Something went wrong while fetching repository meta.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [app.id, env?.id, env?.build?.vars?.["SK_CWD"]]);

  return { meta, loading, error };
};

export type AutoDeployValues = "disabled" | "all" | "custom";

export interface FormValues {
  name: string;
  branch: string;
  autoDeploy?: AutoDeployValues;
  autoPublish?: "on" | "off";
  autoDeployBranches?: string;
  "build.cmd"?: string;
  "build.distFolder"?: string;
  "build.vars"?: string; // This is the textarea version
  "build.vars[key]"?: string; // This is the key value version
  "build.vars[value]"?: string; // This is the key value version
}

interface UpdateEnvironmentProps {
  app: App;
  envId: string;
  values: FormValues;
  setLoading: (b: boolean) => void;
  setError: (s: string) => void;
  setSuccess: (s: string) => void;
  setRefreshToken: (t: number) => void;
}

export const updateEnvironment = ({
  app,
  envId,
  values,
  setError,
  setLoading,
  setSuccess,
  setRefreshToken,
}: UpdateEnvironmentProps): Promise<void> => {
  const { name, branch, autoDeployBranches, autoDeploy } = values;
  const build = prepareBuildObject(values);

  if (!name || !branch) {
    setError("Environment and branch names are required.");
    return Promise.resolve();
  }

  setLoading(true);
  setError("");
  setSuccess("");

  return api
    .put<{ status: boolean }>(`/app/env`, {
      id: envId,
      appId: app.id,
      env: name,
      branch,
      build,
      autoPublish: values.autoPublish === "on",
      autoDeploy: autoDeploy !== "disabled",
      autoDeployBranches: autoDeployBranches || null,
    })
    .then(() => {
      setSuccess("The environment has been successfully updated.");
      setRefreshToken(Date.now());
    })
    .catch(async res => {
      if (typeof res === "string") {
        return setError(res);
      }

      try {
        const jsonData = await res.json();
        setError(jsonData.error);
      } catch {
        setError(`"Error: ${(await res?.body()) || res}`);
      }
    })
    .finally(() => {
      setLoading(false);
    });
};

interface InsertEnvironmentProps {
  app: App;
  values: FormValues;
}

interface InsertEnvironmentReturnValue {
  envId: string;
}

export const insertEnvironment = ({
  app,
  values,
}: InsertEnvironmentProps): Promise<InsertEnvironmentReturnValue> => {
  const { name, branch, autoDeployBranches, autoDeploy } = values;
  const build = prepareBuildObject(values);

  if (!name || !branch) {
    return new Promise((_, reject) => {
      reject("Environment and branch names are required.");
    });
  }

  return api.post<{ envId: string }>(`/app/env`, {
    appId: app.id,
    env: name,
    branch,
    build,
    autoPublish: values.autoPublish === "on",
    autoDeploy: autoDeploy !== "disabled",
    autoDeployBranches: autoDeployBranches || null,
  });
};

export interface IntegrationFormValues extends Record<string, string> {
  integration: "bunny_cdn" | "aws_s3";
  externalUrl: string;
}

interface UpdateIntegrationProps {
  app: App;
  environmentId: string;
  values: IntegrationFormValues;
}

export const updateIntegration = ({
  values,
  app,
  environmentId,
}: UpdateIntegrationProps): Promise<void> => {
  if (
    !(values.integration === "bunny_cdn" || values.integration === "aws_s3")
  ) {
    return Promise.reject(
      "Invalid integration provided. Allowed values are: bunny_cdn, aws_s3"
    );
  }

  try {
    new URL(values.externalUrl);
  } catch {
    return Promise.reject(
      "Invalid URL provided. Please provide a valid URL, including the protocol. e.g. https://www.stormkit.io"
    );
  }

  const config: CustomStorage = {
    integration: values.integration,
    externalUrl: values.externalUrl,
    settings: {},
  };

  // We receive the key name in string format: settings.STORAGE_KEY
  // This snippets creates an object from it.
  Object.keys(values).forEach(key => {
    if (key.indexOf(".") === -1) {
      return;
    }

    config.settings[key.split(".")[1]] = values[key];
  });

  return api.put(`/app/env/custom-storage`, {
    appId: app.id,
    envId: environmentId,
    config,
  });
};

interface DeleteIntegrationProps {
  app: App;
  environmentId: string;
}

export const deleteIntegration = ({
  app,
  environmentId,
}: DeleteIntegrationProps): Promise<void> => {
  return api.delete(`/app/env/custom-storage`, {
    appId: app.id,
    envId: environmentId,
  });
};

interface DeleteEnvironmentProps {
  app: App;
  environment: Environment;
}

export const deleteEnvironment = ({
  app,
  environment,
}: DeleteEnvironmentProps): Promise<void> => {
  const name = environment?.env;

  if (!name) {
    return Promise.reject();
  }

  return api.delete(`/app/env`, {
    appId: app.id,
    env: name,
  });
};

interface FetchAPIKeyProps {
  appId: string;
  envId: string;
}

export const useFetchAPIKey = ({ appId, envId }: FetchAPIKeyProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [apiKey, setApiKey] = useState<string>();

  useEffect(() => {
    setLoading(true);
    setError(undefined);

    api
      .fetch<{ apiKey: string }>(`/app/${appId}/env/${envId}/api-keys`)
      .then(({ apiKey }) => {
        setApiKey(apiKey);
      })
      .catch(() => {
        setError("Something went wrong while fetching api key");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [appId, envId]);

  return { loading, error, apiKey, setApiKey };
};

export const generateNewAPIKey = ({ appId, envId }: FetchAPIKeyProps) => {
  return api.post<{ apiKey: string }>("/app/env/api-key", { appId, envId });
};
