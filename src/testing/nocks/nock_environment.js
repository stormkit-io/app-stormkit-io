import nock from "nock";

export const mockAppProxy = ({ app, status = 200, envs = [] }) => {
  envs.forEach((env) => {
    const domain = env.domain?.verified
      ? env.domain.name
      : `${app.displayName}--${env.env}.stormkit.dev`;

    nock(process.env.API_DOMAIN)
      .post(`/app/proxy`, { appId: app.id, url: `https://${domain}` })
      .reply(200, { status });
  });
};

export const mockMetaCall = ({ name, appId }) =>
  nock(process.env.API_DOMAIN)
    .get(`/app/${appId}/envs/${name}/meta`)
    .reply(200, { packageJson: true, type: "-" });

export const mockEnvironmentInsertionCall = () =>
  nock(process.env.API_DOMAIN)
    .post(`/app/env`, {
      appId: "1",
      env: "staging",
      branch: "my-branch",
      build: {
        cmd: "npm run build",
        entry: "",
        distFolder: "",
        vars: { NODE_ENV: "development" },
      },
      autoPublish: true,
    })
    .reply(200, { status: 200 });

export const mockEnvironmentUpdateCall = () =>
  nock(process.env.API_DOMAIN)
    .put(`/app/env`, {
      appId: "1",
      env: "production",
      branch: "master-new",
      build: {
        cmd: "yarn test && yarn run build:console",
        entry: "packages/console/server/renderer.js",
        distFolder: "packages/console/dist",
        vars: {
          BABEL_ENV: "production",
          NODE_ENV: "production",
        },
      },
      autoPublish: true,
    })
    .reply(200, { ok: true });

export const mockEnvironmentDeleteCall = () =>
  nock(process.env.API_DOMAIN)
    .delete(`/app/env`, {
      appId: "1",
      env: "development",
    })
    .reply(200, { ok: true });
