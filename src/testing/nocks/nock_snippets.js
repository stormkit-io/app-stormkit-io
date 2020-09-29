import nock from "nock";
import * as data from "../data";

export const mockSnippetsResponse = ({
  app,
  env,
  status = 200,
  response = data.mockSnippetsResponse()
}) =>
  nock(process.env.API_DOMAIN)
    .get(`/app/${app.id}/envs/${env.env}/snippets`)
    .reply(status, response);
