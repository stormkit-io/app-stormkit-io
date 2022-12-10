import { useEffect, useState } from "react";
import api from "~/utils/api/Api";

interface FetchFunctionTriggersArgs {
  appId?: string;
  environmentId?: string;
}

interface FetchFunctionTriggersReturnValue {
  functionTriggers: FunctionTrigger[];
  error: string | null;
  loading: boolean;
  setReload: (val: number) => void;
}

export const useFetchFunctionTriggers = ({
  appId,
  environmentId,
}: FetchFunctionTriggersArgs): FetchFunctionTriggersReturnValue => {
  const [flags, setFlags] = useState<FunctionTrigger[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState<number>();

  useEffect(() => {
    if (!appId || !environmentId) {
      return;
    }

    let unmounted = false;
    setLoading(true);

    api
      .fetch<FunctionTrigger[]>(
        `/apps/${appId}/envs/${environmentId}/function-triggers`
      )
      .then(result => {
        if (!unmounted) {
          setFlags(result);
        }
      })
      .catch(() => {
        if (!unmounted) {
          setError("Something went wrong while fetching trigger functions");
        }
      })
      .finally(() => {
        if (!unmounted) {
          setLoading(false);
        }
      });

    return () => {
      unmounted = true;
    };
  }, [appId, environmentId, reload]);

  return { functionTriggers: flags, loading, error, setReload };
};

interface DeleteFunctionTriggerProps {
  tfid: string;
  appId: string;
}

export function deleteFunctionTrigger({
  tfid,
  appId,
}: DeleteFunctionTriggerProps): Promise<void> {
  return api.delete(`/apps/function-trigger/${tfid}`, { appId });
}

interface CreateFunctionTriggerProps extends Omit<FunctionTrigger, "options"> {
  appId: string;
  envId: string;
  options: FunctionTriggerOptions;
}

export function createFunctionTrigger(
  args: CreateFunctionTriggerProps
): Promise<FunctionTrigger> {
  if (args.appId === "" || args.envId === "") {
    return Promise.reject("AppId and EnvId cannot be empty.");
  }

  if (args.cron === "") {
    return Promise.reject("Cron cannot be empty.");
  }

  if (args.options.url === "") {
    return Promise.reject("Url cannot be empty.");
  }

  return api.post(`/apps/function-trigger`, {
    ...args,
  });
}

interface UpdateFunctionTriggerProps {
  appId: string;
  tfid: string;
  cron: string;
  status: boolean;
  options: FunctionTriggerOptions;
}

export const updateFunctionTrigger = ({
  appId,
  tfid,
  cron,
  status,
  options,
}: UpdateFunctionTriggerProps): Promise<void> => {
  if (options.url.trim() === "") {
    return Promise.reject("Url cannot be empty.");
  }

  if (cron.trim() === "") {
    return Promise.reject("Cron cannot be empty.");
  }

  return api.patch(`/apps/function-trigger`, {
    id: tfid,
    appId,
    status,
    cron,
    options,
  });
};

interface UpsertFunctionTriggerProps {
  appId: string;
  envId: string;
  tfid?: string;
  status: boolean;
  cron: string;
  options: FunctionTriggerOptions;
}

export const upsertFunctionTrigger = ({
  appId,
  envId,
  tfid,
  status,
  cron,
  options,
}: UpsertFunctionTriggerProps): Promise<void | FunctionTrigger> => {
  if (tfid) {
    return updateFunctionTrigger({ tfid, status, cron, options, appId });
  }

  return createFunctionTrigger({
    appId,
    envId,
    status,
    cron,
    options,
  });
};
