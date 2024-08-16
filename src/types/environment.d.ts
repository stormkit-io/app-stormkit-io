declare type BuildConfig = {
  prerender?: PrerenderConfig;
  previewLinks?: boolean;
  apiFolder?: string;
  headersFile?: string;
  redirectsFile?: string;
  redirects?: Redirect[];
  distFolder: string;
  buildCmd?: string;
  serverCmd?: string;
  serverFolder?: string;
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

interface Redirect {
  from: string;
  to: string;
  status?: number;
  assets?: boolean;
  hosts?: string[];
}

interface PrerenderConfig {
  matchUserAgent: string;
  waitFor: string;
  cacheDuration: number;
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
  autoDeployBranches?: string | null;
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
  customCert?: {
    value: string;
    key: string;
  };
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
