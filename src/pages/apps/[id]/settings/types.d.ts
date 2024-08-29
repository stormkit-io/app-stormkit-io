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

export type AllowedMethod = "GET" | "POST" | "HEAD";

export type TriggerWhen = "on_deploy" | "on_publish";

export interface OutboundWebhook {
  id?: string;
  triggerWhen: TriggerWhen;
  requestUrl: string;
  requestMethod: AllowedMethod;
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
