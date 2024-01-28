export default (): DeploymentV2[] => [
  {
    apiPackageSize: 88928,
    appId: "1644802351",
    branch: "main",
    clientPackageSize: 3084966,
    commit: {
      author: "Joe Doe \u003cjoe@stormkit.io\u003e",
      message: "chore: update packages",
      sha: "ea79f58893a81354a24a61162311c8e8801bf61e",
    },
    createdAt: "1706226189",
    displayName: "sample-project",
    envId: "1644802351",
    envName: "production",
    id: "36185651722",
    isAutoDeploy: false,
    isAutoPublish: false,
    previewUrl: "http://sample-project--36185651722.stormkit:8888",
    repo: "github/stormkit-io/sample-project",
    serverPackageSize: 0,
    snapshot: {
      build: {
        cmd: "npm run build",
        distFolder: "build",
        vars: {
          NODE_ENV: "production",
          SK_CWD: "/.",
        },
      },
      env: "production",
      envId: "1644802351",
    },
    status: "success",
    stoppedAt: "",
    detailsUrl: "",
    published: [{ envId: "1644802351", percentage: 100 }],
  },
  {
    apiPackageSize: 88928,
    appId: "1644802351",
    branch: "development",
    clientPackageSize: 3086129,
    commit: {
      author: "Sally Doe \u003csally@stormkit.io\u003e",
      message: "fix: image size",
      sha: "ea79f58893a81354a24a61162311c8e8801bf61e",
    },
    createdAt: "1706226185",
    displayName: "sample-project",
    envId: "1644802351",
    envName: "production",
    id: "34540849371",
    isAutoDeploy: false,
    isAutoPublish: false,
    previewUrl: "http://sample-project--34540849371.stormkit:8888",
    repo: "github/stormkit-io/sample-project",
    serverPackageSize: 0,
    snapshot: {
      build: {
        cmd: "npm run build",
        distFolder: "build",
        vars: {
          NODE_ENV: "production",
          SK_CWD: "/.",
        },
      },
      env: "production",
      envId: "1644802351",
    },
    status: "success",
    stoppedAt: "",
    detailsUrl: "",
    published: [],
  },
];
