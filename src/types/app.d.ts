type autoDeploy = "pull_request" | "commit" | null;

declare interface App {
  id: string;
  teamId: string;
  userId: string;
  repo: string;
  status: boolean;
  endpoint: string;
  createdAt: number;
  deployedAt: number;
  autoDeploy: autoDeploy;
  defaultEnv: string;
  displayName: string;
  refreshToken?: number;
  isBare?: boolean;
  provider?: "github" | "bitbucket" | "gitlab";
  name?: string;
  meta?: {
    isFramework: boolean;
    hasPackageJson: boolean;
    repoType: "nuxt" | "next" | "react" | "vue" | "angular" | "nest" | "-";
  };
}
