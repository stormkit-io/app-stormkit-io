import nock from "nock";
import * as data from "../data";

export const mockFetchUser = ({
  status = 200,
  response = data.mockUserResponse(),
}) => nock(process.env.API_DOMAIN).get("/user").reply(status, response);

export const mockUpdatePersonalAccessToken = ({
  status = 200,
  payload,
  response = { ok: true },
}) =>
  nock(process.env.API_DOMAIN)
    .put("/user/access-token", payload)
    .reply(status, response);
