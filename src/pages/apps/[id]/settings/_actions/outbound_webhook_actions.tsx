import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { RootContextProps } from "~/pages/Root.context";
import type { LocationState, OutboundWebhook } from "../types";

interface FetchOutboundWebhooksProps extends Pick<RootContextProps, "api"> {
  app: App;
  setLoading: SetLoading;
  setError: SetError;
}

interface FetchOutboundWebhooksRequest {
  webhooks: Array<OutboundWebhook>;
}

export const useFetchOutboundWebhooks = ({
  api,
  app,
  setLoading,
  setError,
}: FetchOutboundWebhooksProps): Array<OutboundWebhook> => {
  const location = useLocation<LocationState>();
  const [hooks, setHooks] = useState<Array<OutboundWebhook>>([]);
  const refresh = location?.state?.outboundWebhooksRefresh;

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

interface UpsertOutboundWebhookProps extends Pick<RootContextProps, "api"> {
  app: App;
}

export type FormValues = Omit<OutboundWebhook, "requestHeaders"> & {
  requestHeaders: string;
};

export const upsertOutboundWebhook =
  ({ api, app }: UpsertOutboundWebhookProps) =>
  ({
    id,
    requestUrl,
    requestHeaders,
    requestMethod,
    requestPayload,
    triggerWhen,
  }: FormValues): Promise<void> => {
    const hooks: OutboundWebhook = {
      requestUrl,
      requestMethod,
      requestPayload,
      triggerWhen,
      requestHeaders: requestHeaders
        ? requestHeaders
            .split("\n")
            .reduce((obj: Record<string, string>, val: string) => {
              const [headerName, headerValue] = val.split(":");

              if (headerValue) {
                obj[headerName.toLowerCase()] = headerValue.replace(/^\s+/, "");
              }

              return obj;
            }, {})
        : undefined,
    };

    const method = id ? "put" : "post";

    return api[method](`/app/outbound-webhooks`, {
      ...hooks,
      whId: id || undefined,
      appId: app.id,
    });
  };

interface SendSampleRequestProps extends Pick<RootContextProps, "api"> {
  app: App;
  whId?: string;
}

export interface SendSampleRequestResponse {
  error?: string;
  result: {
    status: number;
    body: string;
  };
}

export const sendSampleRequest = ({
  app,
  api,
  whId,
}: SendSampleRequestProps): Promise<SendSampleRequestResponse> => {
  return api.fetch<SendSampleRequestResponse>(
    `/app/${app.id}/outbound-webhooks/${whId}/trigger`
  );
};

interface DeleteOutboundWebhookProps extends Pick<RootContextProps, "api"> {
  app: App;
  whId?: string;
}

export const deleteOutboundWebhook = ({
  app,
  api,
  whId,
}: DeleteOutboundWebhookProps): Promise<void> => {
  return api.delete(`/app/outbound-webhooks`, {
    whId,
    appId: app.id,
  });
};
