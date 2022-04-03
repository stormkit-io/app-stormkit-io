declare type BuildConfig = {
  entry: string;
  distFolder: string;
  cmd: string;
  vars: Record<string, string>;
};

type DomainConfig = {
  name?: string;
  cname?: string;
  verified: boolean;
};

type LastDeploy = {
  id: string;
  createdAt: number;
  exit: number; // TODO: Typeify this
};

declare type Integration = "bunny_cdn" | "aws_s3";

declare type CustomStorage = {
  integration: Integration;
  externalUrl: string;
  settings: Record<string, string>;
};

declare type Environment = {
  id?: string;
  env: string; // Name of the environment - will be deprecated.
  name: string;
  appId: string;
  branch: string;
  autoPublish: boolean;
  build: BuildConfig;
  allowedBranches: string;
  domain: DomainConfig;
  lastDeploy?: LastDeploy;
  customStorage?: CustomStorage;
  getDomainName?: () => string;
};
