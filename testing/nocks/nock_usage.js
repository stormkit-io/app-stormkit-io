import nock from "nock";
import * as data from "../data";

const endpoint = process.env.API_DOMAIN;

export const mockFetchUsage = ({
  app,
  status = 200,
  response = data.mockUsageResponse(),
}) => nock(endpoint).get(`/app/${app.id}/usage`).reply(status, response);
