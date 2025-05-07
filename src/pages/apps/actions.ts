import { useEffect, useState } from "react";
import pLimit from "p-limit";
import api from "~/utils/api/Api";

interface FetchAppListProps {
  from?: number;
  filter?: string;
  teamId?: string;
}

interface FetchAppListReturnValue {
  apps: Array<App>;
  error: string | null;
  loading: boolean;
  hasNextPage: boolean;
}

interface FetchAppListAPIResponse {
  apps: Array<App>;
  hasNextPage: boolean;
}

export const useFetchAppList = ({
  from = 0,
  filter,
  teamId,
}: FetchAppListProps): FetchAppListReturnValue => {
  const [apps, setApps] = useState<Array<App>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    let unmounted = false;

    if (!teamId) {
      setApps([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const params = new URLSearchParams(
      JSON.parse(
        JSON.stringify({
          teamId,
          filter,
          from,
        })
      )
    );

    api
      .fetch<FetchAppListAPIResponse>(`/apps?${params.toString()}`)
      .then(res => {
        if (unmounted !== true) {
          if (from > 0) {
            setApps([...apps, ...res.apps]);
          } else {
            setApps(res.apps);
          }

          setHasNextPage(res.hasNextPage);
          setLoading(false);
        }
      })
      .catch(e => {
        if (unmounted !== true) {
          setError(e.message);
        }
      });

    return () => {
      unmounted = true;
    };
  }, [api, from, filter, teamId]);

  return { apps, loading, error, hasNextPage };
};

interface FetchAppProps {
  appId?: string;
}

interface FetchAppReturnValue {
  app: App | undefined;
  loading: boolean;
  error: string | null;
  refreshToken?: number;
  setRefreshToken: (val: number) => void;
}

interface FetchAppAPIResponse {
  app: App;
}

const appCache: Record<string, App> = {};

export const useFetchApp = ({ appId }: FetchAppProps): FetchAppReturnValue => {
  const [app, setApp] = useState<App | undefined>(appCache[appId!]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [refreshToken, setRefreshToken] = useState<number>();

  useEffect(() => {
    let unmounted = false;

    if (appCache[appId!] || !appId) {
      return;
    }

    setLoading(true); // Do not refresh when updating app object.
    setError(null);

    api
      .fetch<FetchAppAPIResponse>(`/app/${appId}`)
      .then(res => {
        const app = res.app;
        const pieces = app.repo.split("/");
        const provider = pieces.shift();

        if (
          provider === "github" ||
          provider === "gitlab" ||
          provider === "bitbucket"
        ) {
          app.provider = provider;
          app.name = pieces.join("/");
        }

        if (unmounted !== true) {
          setApp(app);
        }
      })
      .catch(async res => {
        if (res.status === 404) {
          return;
        }

        try {
          const error = await res.json();

          if (unmounted !== true) {
            setApp(undefined);
            setError(error);
          }
        } catch (e) {
          if (unmounted !== true) {
            setError(
              "Something went wrong on our side. Please try again. If the problem persists reach us out through Discord or email."
            );
          }
        }
      })
      .finally(() => {
        if (unmounted !== true) {
          setLoading(false);
        }
      });

    return () => {
      unmounted = true;
    };
  }, [api, appId, refreshToken]);

  return { app, loading, error, refreshToken, setRefreshToken };
};

interface DeployProps {
  app: App;
  files?: File[];
  config?: {
    buildCmd?: string;
    branch?: string;
    distFolder?: string;
    publish: boolean;
  };
  environment?: Environment;
  setError: SetError;
  setLoading: SetLoading;
}

interface DeployAPIResponse {
  id: string;
}

const CHUNK_SIZE = 9 * 1024 * 1024; // 9MB

export const deploy = ({
  app,
  files,
  config,
  setLoading,
  setError,
  environment,
}: DeployProps): Promise<DeployAPIResponse | void> => {
  if (!environment) {
    return Promise.resolve(setError("Please select an environment."));
  }

  setLoading(true);

  const handleUploadError = async (res: Response) => {
    if (res.status === 429) {
      return setError((await api.errors(res))[0]);
    }

    if (res.status === 401 || res.status === 403 || res.status === 404) {
      return setError("repo-not-found");
    }

    let message = "";

    try {
      const data = await res.json();
      message = data.error;
    } catch {}

    setError(
      message ||
        "Something wrong happened here. Please contact us at hello@stormkit.io"
    );
  };

  if (files && files.length > 0) {
    if (files.length !== 1) {
      setError("You can upload only one file at a time.");
      return Promise.resolve();
    }

    const file = files[0]; // Assume only one file is uploaded
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const fileId = `${app.id}-${Date.now()}`; // Unique file ID

    const promises: Promise<DeployAPIResponse>[] = [];
    const limit = pLimit(3); // Limit the number of concurrent uploads

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      // Create a FormData object to hold the files
      const formData = new FormData();

      formData.append("appId", app.id);
      formData.append("envId", environment.id!);
      formData.append("publish", config?.publish ? "true" : "false");
      formData.append("files", chunk, file.name);

      promises.push(
        limit(() =>
          api.upload<DeployAPIResponse>("/app/deploy", {
            body: formData,
            headers: {
              "X-File-ID": fileId,
              "X-Chunked-Upload": totalChunks > 0 ? "true" : "false",
              "X-Total-Chunks": Math.max(totalChunks, 1).toString(),
              "X-Chunk-Index": i.toString(),
            },
          })
        )
      );
    }

    return Promise.all(promises)
      .then(res => {
        // Return the response with the deployment id
        for (let i = 0; i < res.length; i++) {
          if (res[i].id) {
            return res[i];
          }
        }
      })
      .catch(handleUploadError)
      .finally(() => {
        setLoading(false);
      });
  }

  return api
    .post<DeployAPIResponse>(`/app/deploy`, {
      envId: environment.id,
      appId: app.id,
      ...config,
    })
    .catch(handleUploadError)
    .finally(() => {
      setLoading(false);
    });
};

interface CreateAppProps {
  teamId?: string;
}

export const createApp = ({ teamId }: CreateAppProps): Promise<App> => {
  return api.post<{ app: App }>("/app", { teamId }).then(({ app }) => app);
};
