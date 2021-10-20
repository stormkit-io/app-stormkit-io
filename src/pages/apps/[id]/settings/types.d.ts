export interface LocationState extends Location {
  triggerDeploysSuccess: string | null;
  integrationsSuccess: string | null;
  app: number | null;
}

export type Runtime = "nodejs12.x" | "nodejs14.x";

export interface AppSettings {
  envs: Array<string>;
  runtime: Runtime;
  deployTrigger?: boolean;
  deployHooks?: {
    slack: {
      webhook: string;
      channel: string;
      onEnd: boolean;
      onPublish: boolean;
      onStart: boolean;
    };
  };
}
