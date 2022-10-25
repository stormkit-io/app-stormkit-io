import nock from "nock";
import * as data from "../data";

const endpoint = process.env.API_DOMAIN || "";

export const mockFetchApp = ({ app = data.mockApp(), status = 200 }) =>
  nock(endpoint).get(`/app/${app.id}`).reply(status, { app });

interface MockInsertAppProps {
  provider: Provider;
  repo: string;
  id: string;
  status?: number;
}

export const mockInsertApp = ({
  provider,
  repo,
  id,
  status = 200,
}: MockInsertAppProps) =>
  nock(endpoint)
    .post(`/app`, { provider, repo })
    .reply(status, { app: { id } });

interface MockFetchAppsProps {
  from?: number;
  filter?: string;
  status?: number;
  response: { apps: App[]; hasNextPage: boolean };
}

export const mockFetchApps = ({
  from = 0,
  filter = "",
  status = 200,
  response,
}: MockFetchAppsProps) =>
  nock(endpoint)
    .get(`/apps?from=${from}&filter=${filter}`)
    .reply(status, response);

interface DeleteAppProps {
  appId: string;
  status?: number;
  response: { ok: boolean };
}

export const mockDeleteApp = ({ appId, status, response }: DeleteAppProps) =>
  nock(endpoint).delete(`/app`, { appId }).reply(status, response);
