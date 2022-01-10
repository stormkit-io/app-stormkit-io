import React, { useEffect, useState } from "react";
import { Link, RouteComponentProps, useLocation } from "react-router-dom";
import { RootContextProps } from "~/pages/Root.context";
import type { LocationState, OutboundWebhooks } from "../types";

interface FetchOutboundWebhooksProps extends Pick<RootContextProps, "api"> {
  app: App;
  setLoading: SetLoading;
  setError: SetError;
}

interface FetchOutboundWebhooksRequest {
  webhooks: Array<OutboundWebhooks>;
}

export const useFetchOutboundWebhooks = ({
  api,
  app,
  setLoading,
  setError,
}: FetchOutboundWebhooksProps): Array<OutboundWebhooks> => {
  const location = useLocation<LocationState>();
  const [hooks, setHooks] = useState<Array<OutboundWebhooks>>([]);
  const refresh = location?.state?.app;

  useEffect(() => {
    let unmounted = false;

    setError(null);
    setLoading(true);

    api
      .fetch<FetchOutboundWebhooksRequest>(`/app/${app.id}/outbound-webhooks`)
      .then(res => {
        if (unmounted !== true) {
          setHooks(res.webhooks);
        }
      })
      .catch(() => {
        if (unmounted !== true) {
          setError(
            "Something went wrong while fetching the outbound webhooks."
          );
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
  }, [app.id, refresh]);

  return hooks;
};

interface CreateOutboundWebhookProps extends Pick<RootContextProps, "api"> {
  app: App;
}

export const createOutboundWebhook =
  ({ api, app }: CreateOutboundWebhookProps) =>
  (values: Omit<OutboundWebhooks, "id">): Promise<void> => {
    return api.post(`/app/outbound-webhooks`, { ...values, appId: app.id });
  };
