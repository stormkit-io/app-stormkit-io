import nock from "nock";
import * as data from "../data";

const endpoint = process.env.API_DOMAIN || "localhost";

interface MockFetchDeploymentCallProps {
  app?: App;
  deploy?: Deployment;
  status?: number;
  response?: object;
}

export const mockFetchDeploymentCall = ({
  app,
  deploy,
  status = 200,
  response = data.mockDeploymentResponse(),
}: MockFetchDeploymentCallProps) =>
  nock(endpoint)
    .get(`/app/${app?.id}/deploy/${deploy?.id}`)
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