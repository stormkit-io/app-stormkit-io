import nock, { Scope } from "nock";

const endpoint = process.env.API_DOMAIN || "";

interface FetchEnvironmentResponse {
  hasNextPage: false;
  envs: Array<Environment>;
}

interface FetchEnvironmentProps {
  app: App;
  status: number;
  response: FetchEnvironmentResponse;
}

export const mockFetchEnvironments = ({
  app,
  status,
  response,
}: FetchEnvironmentProps): Scope =>
  nock(endpoint)
    .get(`/app/${app.id}/envs`)
    .reply(status, response);

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

interface FetchRepoTypeResponse {
  packageJson: boolean;
  type: "-" | "nuxt" | "next" | "angular";
}

interface FetchRepoTypeProps {
  name: string;
  appId: string;
  status: number;
  response: FetchRepoTypeResponse;
}

export const mockFetchRepoType = ({
  name,
  appId,
  status,
  response,
}: FetchRepoTypeProps): Scope =>
  nock(endpoint)
    .get(`/app/${appId}/envs/${name}/meta`)
    .reply(status, response);

interface InsertEnvironmentResponse {
  ok: boolean;
}

interface InsertEnvironmentProps {
  environment: Environment;
  response: InsertEnvironmentResponse;
  status: number;
}

export const mockInsertEnvironment = ({
  environment,
  status = 200,
  response = { ok: true },
}: InsertEnvironmentProps): Scope =>
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

interface UpdateEnvironmentResponse {
  ok: boolean;
}

interface UpdateEnvironmentProps {
  environment: Environment;
  response: UpdateEnvironmentResponse;
  status: number;
}

export const mockUpdateEnvironment = ({
  environment,
  status = 200,
  response = { ok: true },
}: UpdateEnvironmentProps): Scope =>
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

interface DeleteEnvironmentResponse {
  ok: boolean;
}

interface DeleteEnvironmentProps {
  appId: string;
  env: string;
  response: DeleteEnvironmentResponse;
  status?: number;
}

export const mockDeleteEnvironment = ({
  appId,
  env,
  status = 200,
  response = { ok: true },
}: DeleteEnvironmentProps): Scope =>
  nock(endpoint)
    .delete(`/app/env`, {
      appId,
      env,
    })
    .reply(status, response);
