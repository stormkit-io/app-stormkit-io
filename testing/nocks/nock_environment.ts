import nock from "nock";

const endpoint = process.env.API_DOMAIN || "";

interface FetchStatusProps {
  url: string;
  appId: string;
  status?: number;
  response?: { status: number };
}

export const mockFetchStatus = ({
  appId,
  url,
  status = 200,
  response = { status: 200 },
}: FetchStatusProps) =>
  nock(endpoint).post(`/app/proxy`, { appId, url }).reply(status, response);

interface FetchEnvironmentsProps {
  app: App;
  status?: number;
  response?: object;
}

export const mockFetchEnvironments = ({
  app,
  status,
  response,
}: FetchEnvironmentsProps) =>
  nock(endpoint).get(`/app/${app.id}/envs`).reply(status, response);

interface FetchRepoTypeProps {
  name: string;
  appId: string;
  status?: number;
  response?: object;
}

export const mockFetchRepoType = ({
  name,
  appId,
  status,
  response,
}: FetchRepoTypeProps) =>
  nock(endpoint).get(`/app/${appId}/envs/${name}/meta`).reply(status, response);

interface InsertEnvironmentProps {
  environment: Environment;
  status?: number;
  response?: { ok: boolean };
}

export const mockInsertEnvironment = ({
  environment,
  status = 200,
  response = { ok: true },
}: InsertEnvironmentProps) =>
  nock(endpoint)
    .post(`/app/env`, {
      appId: environment.appId,
      env: environment.name,
      branch: environment.branch,
      autoPublish: environment.autoPublish,
      autoDeploy: environment.autoDeploy,
      autoDeployBranches: environment.autoDeployBranches || null,
      build: {
        ...environment.build,
      },
    })
    .reply(status, response);

interface UpdateEnvironmentProps {
  environment: Environment;
  status?: number;
  response?: { ok: true };
}

export const mockUpdateEnvironment = ({
  environment,
  status = 200,
  response = { ok: true },
}: UpdateEnvironmentProps) =>
  nock(endpoint)
    .put(`/app/env`, {
      appId: environment.appId,
      id: environment.id,
      env: environment.env,
      branch: environment.branch,
      autoPublish: environment.autoPublish,
      autoDeploy: environment.autoDeploy,
      autoDeployBranches: environment.autoDeployBranches || null,
      build: {
        ...environment.build,
      },
    })
    .reply(status, response);

interface DeleteEnvironmentProps {
  appId: string;
  env: string;
  status?: number;
  response?: { ok: boolean };
}

export const mockDeleteEnvironment = ({
  appId,
  env,
  status = 200,
  response = { ok: true },
}: DeleteEnvironmentProps) =>
  nock(endpoint)
    .delete(`/app/env`, {
      appId,
      env,
    })
    .reply(status, response);

interface CustomStorageProps {
  appId: string;
  envId: string;
  config: BuildConfig;
  status?: number;
  response?: { ok: boolean };
}

export const mockCustomStorage = ({
  appId,
  envId,
  config,
  status = 200,
  response = { ok: true },
}: CustomStorageProps) =>
  nock(endpoint)
    .put(`/app/env/custom-storage`, {
      appId,
      envId,
      config,
    })
    .reply(status, response);
