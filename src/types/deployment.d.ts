type PublishInfo = {
  envId: string;
  percentage: number;
};

type Log = {
  title: string;
  message: string;
  payload: unknown;
  status: boolean;
  duration?: number;
};

type Commit = {
  author?: string;
  message?: string;
  sha?: string;
};

type Config = {
  build: {
    cmd: string;
    distFolder: string;
    vars: Record<string, string>;
  };
  env: string;
  envId: string;
};

declare type Deployment = {
  id: string;
  appId: string;
  branch: string;
  commit: Commit;
  config: Config;
  createdAt: number;
  stoppedAt: number;
  exit: number;
  isAutoDeploy: boolean;
  isRunning: boolean;
  logs: Array<Log>;
  numberOfFiles: number;
  published: Array<PublishInfo>;
  totalSizeInBytes: number;
  serverPackageSize: number;
  preview: string; // The preview endpoint
};

declare type DeploymentV2 = {
  id: string;
  appId: string;
  envId: string;
  envName: string;
  branch: string;
  repo: string;
  displayName: string;
  commit: Commit;
  snapshot: Config;
  createdAt: string;
  stoppedAt: string;
  isAutoDeploy: boolean;
  isAutoPublish: boolean;
  error?: string;
  status: "failed" | "success" | "running";
  logs?: Log[];
  previewUrl?: string;
  detailsUrl: string;
  clientPackageSize?: number;
  serverPackageSize?: number;
  apiPackageSize?: number;
  apiPathPrefix?: string;
  published: {
    envId: string;
    percentage: number;
  }[];
};

interface CDNFile {
  fileName: string;
  headers: Record<string, string>;
}

interface Redirects {
  from: string;
  to: string;
  status?: number;
}

interface APIFile {
  fileName: string;
}

declare type Manifest = {
  cdnFiles?: CDNFile[];
  apiFiles?: APIFile[];
  redirects?: Redirects[] | null;
  functionHandler?: string;
};
