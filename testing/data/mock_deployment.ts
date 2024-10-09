interface Props {
  id?: string;
  appId?: string;
  envId?: string;
  isRunning?: boolean;
}

export default ({ id, appId, envId, isRunning }: Props = {}): Deployment => ({
  id: id || "100332943411",
  appId: appId || "2",
  exit: 0,
  numberOfFiles: 0,
  isRunning: typeof isRunning !== "undefined" ? isRunning : false,
  preview: `http://whalefog-kgfhgn--${id || "100332943411"}.stormkit:8888`,
  totalSizeInBytes: 143416,
  serverPackageSize: 0,
  stoppedAt: 1663786486,
  createdAt: 1663785375,
  isAutoDeploy: false,
  commit: {
    author: "John Doe <jdoe@stormkit.io>",
    message: "chore: bump version",
    sha: "c8b80debdde397405b787cc4ddffcb22867586b4",
  },
  config: {
    build: {
      cmd: "pnpm build",
      distFolder: "",
      vars: {
        NODE_ENV: "production",
      },
    },
    env: "production",
    envId: envId || "2",
  },
  published: [
    {
      envId: envId || "2",
      percentage: 100,
    },
  ],
  branch: "main",
  logs: [
    {
      title: "checkout main",
      message: "Successfully checked out main\n",
      status: true,
      payload: null,
    },
    {
      title: "node --version",
      message: "v16.13.0\n",
      status: true,
      payload: null,
    },
    {
      title: "environment variables",
      message:
        "PUBLIC_URL=/\nSK_COMMIT_SHA=c8b80debdde397405b787cc4ddffcb22867586b4\nNODE_ENV=production\nSK_API_KEY=***********************************************\nSK_APP_ID=2\nSK_ENV_ID=2\nSTORMKIT=true\n",
      status: true,
      payload: null,
    },
    {
      title: "pnpm install",
      message:
        "Lockfile is up to date, resolution step is skipped\nProgress: resolved 1, reused 0, downloaded 0, added 0\nPackages: +649\n",
      status: true,
      payload: null,
    },
    {
      title: "pnpm build",
      message:
        "\n> @ build /private/var/folders/91/88m65rss60bdx11qq7p6c6vc0000gn/T/deployment-100332943411/repo\n> nuxt build\n\nNuxt CLI v3.0.0-rc.8\nℹ Client built in 1124ms\nℹ Building server...\n✔ Server built in 360ms\n✔",
      status: true,
      payload: null,
    },
    {
      title: "deploy",
      message:
        "Successfully deployed client side.\nTotal bytes uploaded: 143.4kB\n\n",
      status: true,
      payload: null,
    },
  ],
});
