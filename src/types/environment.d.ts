type BuildConfig = {
  entry: string;
  distFolder: string;
  cmd: string;
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

declare type Environment = {
  id: string;
  env: string; // Name of the environment - will be deprecated.
  name: string;
  appId: string;
  branch: string;
  autoPublish: boolean;
  build: BuildConfig;
  domain: DomainConfig;
  lastDeploy?: LastDeploy;
  getDomainName?: () => string;
};
