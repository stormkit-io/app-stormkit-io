import nock from "nock";
import * as data from "../data";

const endpoint = process.env.API_DOMAIN || "";

export const mockFetchOutboundWebhooks = ({
  app,
  webhooks = data.mockOutboundWebhooksResponse(),
  status = 200,
}) =>
  nock(endpoint)
    .get(`/app/${app.id}/outbound-webhooks`)
    .reply(status, webhooks);

export const mockCreateOutboundWebhooks = ({ app, hook, status = 200 }) =>
  nock(endpoint)
    .post(`/app/outbound-webhooks`, { appId: app.id, ...hook })
    .reply(status);

export const mockUpdateOutboundWebhooks = ({ app, whId, hook, status = 200 }) =>
  nock(endpoint)
    .put(`/app/outbound-webhooks`, { appId: app.id, whId, ...hook })
    .reply(status);
