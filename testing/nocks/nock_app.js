import nock from "nock";
import * as data from "../data";

const endpoint = process.env.API_DOMAIN || "";

export const mockFetchApp = ({ app = data.mockApp(), status = 200 }) =>
  nock(endpoint)
    .get(`/app/${app.id}`)
    .reply(status, { app });

export const mockFetchApps = ({ from = 0, status = 200, response }) =>
  nock(endpoint)
    .get(`/apps?from=${from}`)
    .reply(status, response);
