declare type BuildConfig = {
  headersFile?: string;
  redirectsFile?: string;
  distFolder: string;
  cmd: string;
  vars: Record<string, string>;
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

interface PublishedInfo {
  commitSha?: string;
  commitAuthor?: string;
  commitMessage?: string;
  deploymentId: string;
  branch: string;
  percentage: number;
}

declare type Environment = {
  id?: string;
  env: string; // Name of the environment - will be deprecated.
  name: string;
  appId: string;
  branch: string;
  autoPublish: boolean;
  build: BuildConfig;
  autoDeploy: boolean;
  autoDeployBranches?: string;
  lastDeploy?: LastDeploy;
  customStorage?: CustomStorage;
  published?: PublishedInfo[];
  preview: string;
};

declare interface Domain {
  id: string;
  domainName: string;
  verified: boolean;
  token?: string;
}

declare interface DomainLookup {
  dns: {
    txt: {
      err?: {
        Err: string;
        IsNotFound: boolean;
        IsTemporary: boolean;
        IsTimeout: boolean;
      };
      lookup: string;
      name: string;
      records: any;
      value: string;
    };
    verified: boolean;
  };
  tls?: any;
  domainName: string;
}
