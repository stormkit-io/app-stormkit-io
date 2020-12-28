type autoDeploy = "pull_request" | "commit" | null;

declare type App = {
  id: string;
  repo: string;
  userId: string;
  status: boolean;
  endpoint: string;
  createdAt: number;
  deployedAt: number;
  autoDeploy: autoDeploy;
  defaultEnv: string;
  displayName: string;
  commitPrefix?: string;
  provider?: "github" | "bitbucket" | "gitlab";
  name?: string;
};
