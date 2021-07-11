import nock from "nock";
import * as data from "../data";

export const mockFetchDeploymentCall = ({
  app,
  deploy,
  status = 200,
  response = data.mockDeploymentResponse(),
}) =>
  nock(process.env.API_DOMAIN)
    .get(`/app/${app.id}/deploy/${deploy.id}`)
    .reply(status, response);

export const mockFetchDeploymentsCall = ({
  appId,
  from = 0,
  filters = {},
  status: responseStatus = 200,
  response,
}) => {
  const cleanFilters = {};

  Object.keys(filters).forEach(key => {
    if (typeof filters[key] === "undefined") {
      cleanFilters[key] = filters[key];
    }
  });

  return nock(process.env.API_DOMAIN)
    .post(`/app/deployments`, { appId, from, ...cleanFilters })
    .reply(responseStatus, response);
};

export const mockStopDeploymentCall = ({
  appId,
  deploymentId,
  status = 200,
  response = { ok: true },
}) =>
  nock(process.env.API_DOMAIN)
    .post(`/app/deploy/stop`, { appId, deploymentId })
    .reply(status, response);
