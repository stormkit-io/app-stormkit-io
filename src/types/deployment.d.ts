type PublishInfo = {
  envId: string;
  percentage: number;
};

type Log = {
  title: string;
  message: string;
  payload: unknown;
  status: boolean;
};

type Commit = {
  author?: string;
  message?: string;
  sha?: string;
};

declare type Deployment = {
  id: string;
  appId: string;
  branch: string;
  commit: Commit;
  config: Environment;
  createdAt: number;
  stoppedAt: number;
  exit: number;
  isAutoDeploy: boolean;
  isRunning: boolean;
  isFork: boolean;
  logs: Array<Log>;
  numberOfFiles: number;
  published: Array<PublishInfo>;
  pullRequestNumber: number | null;
  totalSizeInBytes: number;
  preview: string; // The preview endpoint
  tip: string | null; // A hint which specifies why the deployment failed.
  version: string | null; // The lambda version
};
