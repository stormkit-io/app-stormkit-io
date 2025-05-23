declare type StatusCheck = {
  cmd: string;
  name?: string;
  description?: string;
};

declare type BuildConfig = {
  previewLinks?: boolean;
  apiFolder?: string;
  headersFile?: string;
  redirectsFile?: string;
  redirects?: Redirect[];
  errorFile?: string;
  distFolder: string;
  buildCmd?: string;
  installCmd?: string;
  serverCmd?: string;
  serverFolder?: string; // @deprecated: use distFolder instead.
  statusChecks?: StatusCheck[];
  vars: Record<string, string>;
};

type LastDeploy = {
  id: string;
  createdAt: number;
  exit: number; // TODO: Typeify this
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
  autoDeployCommits?: string | null;
  lastDeploy?: LastDeploy;
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
  lastPing?: {
    status: number;
    lastPingAt: number;
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
