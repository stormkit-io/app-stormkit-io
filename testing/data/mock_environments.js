export default ({ app }) => [
  {
    id: "1429333243019",
    env: "production",
    name: "production",
    branch: "master",
    build: {
      entry: "packages/console/server/renderer.js",
      distFolder: "packages/console/dist",
      cmd: "yarn test \u0026\u0026 yarn run build:console",
      vars: {
        BABEL_ENV: "production",
        NODE_ENV: "production"
      }
    },
    autoPublish: true,
    appId: app.id,
    lastDeploy: { id: "10556341488718", createdAt: 1588622630, exit: 0 },
    domain: {
      name: "app.stormkit.io",
      verified: true,
      cname: "app-stormkit-io-cnmiji6et.hosting.stormkit.io."
    },
    getDomainName() {
      return "app.stormkit.io";
    }
  },
  {
    id: "863521234275",
    env: "development",
    name: "development",
    branch: "env/dev",
    build: {
      entry: "packages/console/server/renderer.js",
      distFolder: "packages/console/dist",
      cmd: "yarn run build:console",
      vars: {
        API_DOMAIN: "https://api.stormkit.io",
        BABEL_ENV: "production",
        NODE_ENV: "production",
        ROOT: "\u003croot\u003e/packages/console"
      }
    },
    autoPublish: false,
    appId: app.id,
    lastDeploy: { id: "3414609680676", createdAt: 1568463533, exit: 0 },
    domain: {
      verified: false
    },
    getDomainName() {
      return `${app.displayName}--development.stormkit.dev`;
    }
  }
];
