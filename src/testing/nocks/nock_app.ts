import nock, { Scope } from "nock";
import * as data from "../data";

const endpoint = process.env.API_DOMAIN || "";

interface FetchAppProps {
  app: App;
  status: number;
}

export const mockFetchApp = ({
  app = data.mockApp(),
  status = 200,
}: FetchAppProps): Scope =>
  nock(endpoint)
    .get(`/app/${app.id}`)
    .reply(status, { app });

interface FetchAppsResponse {
  apps: Array<App>;
  hasNextPage: boolean;
}
interface FetchAppsProps {
  from?: number;
  status?: number;
  response: FetchAppsResponse;
}

export const mockFetchApps = ({
  from = 0,
  status = 200,
  response,
}: FetchAppsProps): Scope =>
  nock(endpoint)
    .get(`/apps?from=${from}`)
    .reply(status, response);
