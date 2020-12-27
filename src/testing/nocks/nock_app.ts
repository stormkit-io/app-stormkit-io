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
