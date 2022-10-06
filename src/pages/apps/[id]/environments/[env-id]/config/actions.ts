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
