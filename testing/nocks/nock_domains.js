import nock from "nock";
import * as data from "../data";

export const mockDomainInsertCall = ({
  app,
  env,
  domain,
  status = 200,
  response = { ok: true }
}) =>
  nock(process.env.API_DOMAIN)
    .put(`/app/env/domain`, { appId: app.id, env: env.env, domain })
    .reply(status, response);

export const fetchDomainsInfo = ({
  app,
  env,
  status = 200,
  response = data.mockDomainFetchResponse()
}) =>
  nock(process.env.API_DOMAIN)
    .get(`/app/${app.id}/envs/${env.env}/lookup`)
    .reply(status, response);
