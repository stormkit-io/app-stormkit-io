import nock from "nock";
import * as data from "../data";

export const mockFetchDeploymentsCall = ({
  app,
  deploy,
  status = 200,
  response = data.mockDeploymentResponse(),
}) =>
  nock(process.env.API_DOMAIN)
    .get(`/app/${app.id}/deploy/${deploy.id}`)
    .reply(status, response);
