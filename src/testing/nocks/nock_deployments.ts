import nock from "nock";
import mockDeployment from "../data/mock_deployment";

const endpoint = process.env.API_DOMAIN || "localhost";

interface MockFetchDeploymentCallProps {
  deploy?: Deployment;
  status?: number;
  response?: { deploy: Deployment };
}

export const mockFetchDeploymentCall = ({
  deploy,
  status = 200,
  response = { deploy: mockDeployment({}) },
}: MockFetchDeploymentCallProps) =>
  nock(endpoint)
    .get(`/app/${deploy?.appId}/deploy/${deploy?.id}`)
    .reply(status, response);

interface MockFetchDeploymentsCallProps {
  appId: string;
  from?: number;
  filters: Record<string, unknown>;
  response: { hasNextPage: boolean; deploys: Deployment[] };
  status?: number;
}

export const mockFetchDeploymentsCall = ({
  appId,
  from = 0,
  filters = {},
  status: responseStatus = 200,
  response,
}: MockFetchDeploymentsCallProps) => {
  const cleanFilters = JSON.parse(JSON.stringify(filters));

  return nock(endpoint)
    .post(`/app/deployments`, { appId, from, ...cleanFilters })
    .reply(responseStatus, response);
};

interface MockStopDeploymentCallProps {
  appId: string;
  deploymentId: string;
  status?: number;
  response?: object;
}

export const mockStopDeploymentCall = ({
  appId,
  deploymentId,
  status = 200,
  response = { ok: true },
}: MockStopDeploymentCallProps) =>
  nock(endpoint)
    .post(`/app/deploy/stop`, { appId, deploymentId })
    .reply(status, response);

interface MockDeleteDeploymentCallProps {
  appId: string;
  deploymentId: string;
  status?: number;
  response?: object;
}

export const mockDeleteDeploymentCall = ({
  appId,
  deploymentId,
  status = 200,
  response = { ok: true },
}: MockDeleteDeploymentCallProps) =>
  nock(endpoint)
    .delete(`/app/deploy`, { appId, deploymentId })
    .reply(status, response);

interface MockPublishDeploymentsCallProps {
  appId: string;
  envId: string;
  publish: { percentage: number; deploymentId: string }[];
  status?: number;
  response?: object;
}

export const mockPublishDeploymentsCall = ({
  appId,
  envId,
  publish,
  status = 200,
  response = { ok: true },
}: MockPublishDeploymentsCallProps) =>
  nock(endpoint)
    .post(`/app/deployments/publish`, { appId, envId, publish })
    .reply(status, response);

interface mockFetchManifestCallProps {
  appId: string;
  deploymentId: string;
  status?: number;
  response: { manifest?: Manifest };
}

export const mockFetchManifestCall = ({
  appId,
  deploymentId,
  status = 200,
  response = { manifest: {} },
}: mockFetchManifestCallProps) =>
  nock(endpoint)
    .get(`/app/${appId}/manifest/${deploymentId}`)
    .reply(status, response);

interface mockDeployNowProps {
  appId: string;
  config: {
    env: string;
    buildCmd: string;
    branch: string;
    distFolder: string;
    publish: boolean;
  };
  status?: number;
  response: { id?: string; error?: string };
}

export const mockDeployNow = ({
  appId,
  config,
  status = 200,
  response,
}: mockDeployNowProps) => {
  return nock(endpoint)
    .post("/app/deploy", {
      ...config,
      appId,
    })
    .reply(status, response);
};
