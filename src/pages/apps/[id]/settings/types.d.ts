export interface LocationState extends Location {
  triggerDeploysSuccess: string | null;
  integrationsSuccess: string | null;
  outboundWebhooksRefresh: number | null;
  app: number | null;
}

export type Runtime = "nodejs12.x" | "nodejs14.x" | "nodejs16.x";

export interface AppSettings {
  envs: Array<string>;
  runtime: Runtime;
  deployTrigger?: boolean;
}

export interface OutboundWebhook {
  id?: string;
  triggerWhen: "on_deploy" | "on_publish";
  requestUrl: string;
  requestMethod: "GET" | "POST" | "HEAD";
  requestPayload?: string;
  requestHeaders?: Record<string, string>;
}

export interface OutboundWebhookFormHeader {
  key: string;
  value: string;
}

export type OutboundWebhookFormValues = Omit<
  OutboundWebhook,
  "requestHeaders"
> & {
  "headers[key]": Array<string> | string;
  "headers[value]": Array<string> | string;
};
