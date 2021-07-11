import nock from "nock";

const endpoint = process.env.API_DOMAIN || "";

export const mockFetchEnvironments = ({ app, status, response }) =>
  nock(endpoint).get(`/app/${app.id}/envs`).reply(status, response);

// export const mockAppProxy = ({ app, status = 200, envs = [] }) => {
//   envs.forEach((env) => {
//     const domain = env.domain?.verified
//       ? env.domain.name
//       : `${app.displayName}--${env.env}.stormkit.dev`;

//     nock(process.env.API_DOMAIN)
//       .post(`/app/proxy`, { appId: app.id, url: `https://${domain}` })
//       .reply(200, { status });
//   });
// };

export const mockFetchRepoType = ({ name, appId, status, response }) =>
  nock(endpoint).get(`/app/${appId}/envs/${name}/meta`).reply(status, response);

export const mockInsertEnvironment = ({
  environment,
  status = 200,
  response = { ok: true },
}) =>
  nock(endpoint)
    .post(`/app/env`, {
      appId: environment.appId,
      env: environment.name,
      branch: environment.branch,
      autoPublish: environment.autoPublish,
      build: {
        ...environment.build,
      },
    })
    .reply(status, response);

export const mockUpdateEnvironment = ({
  environment,
  status = 200,
  response = { ok: true },
}) =>
  nock(endpoint)
    .put(`/app/env`, {
      appId: environment.appId,
      env: environment.env,
      branch: environment.branch,
      autoPublish: environment.autoPublish,
      build: {
        ...environment.build,
      },
    })
    .reply(status, response);

export const mockDeleteEnvironment = ({
  appId,
  env,
  status = 200,
  response = { ok: true },
}) =>
  nock(endpoint)
    .delete(`/app/env`, {
      appId,
      env,
    })
    .reply(status, response);
