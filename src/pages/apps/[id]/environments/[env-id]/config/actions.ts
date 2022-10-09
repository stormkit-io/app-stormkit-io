import { useEffect, useState } from "react";
import { toArray } from "~/utils/helpers/array";
import api from "~/utils/api/Api";

export const prepareBuildObject = (values: FormValues): BuildConfig => {
  const vars: Record<string, string> = {};

  const keys = toArray<string>(values["build.vars[key]"] || "");
  const vals = toArray<string>(values["build.vars[value]"] || "");

  keys.forEach((key, i) => {
    if (key.trim() !== "") {
      vars[key.trim()] = vals[i].trim().replace(/^['"]+|['"]+$/g, "");
    }
  });

  const build: BuildConfig = {
    cmd: values["build.cmd"]?.trim(),
    distFolder: (values["build.distFolder"] || "").trim(),
    vars,
  };

  return build;
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
  autoDeploy: AutoDeployValues;
  autoPublish: "on" | "off";
  branch: string;
  autoDeployBranches?: string;
  "build.cmd": string;
  "build.distFolder"?: string;
  "build.vars[key]"?: string;
  "build.vars[value]"?: string;
}

interface EditEnvironmentProps {
  app: App;
  environmentId: string;
  values: FormValues;
}

interface EditEnvironmentReturnValue {
  status: boolean;
}

export const editEnvironment = ({
  app,
  environmentId,
  values,
}: EditEnvironmentProps): Promise<EditEnvironmentReturnValue> => {
  const { name, branch, autoDeployBranches, autoDeploy } = values;
  const build = prepareBuildObject(values);

  if (!name || !branch) {
    return new Promise((_, reject) => {
      reject("Environment and branch names are required.");
    });
  }

  return api.put<{ status: boolean }>(`/app/env`, {
    id: environmentId,
    appId: app.id,
    env: name,
    branch,
    build,
    autoPublish: values.autoPublish === "on",
    autoDeploy: autoDeploy !== "disabled",
    autoDeployBranches: autoDeployBranches || null,
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
