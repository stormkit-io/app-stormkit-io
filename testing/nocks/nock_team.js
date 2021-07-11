import nock from "nock";
import * as data from "../data";

export const mockInviteMemberCall = ({
  app,
  displayName,
  provider,
  status = 200,
  response = {},
}) =>
  nock(process.env.API_DOMAIN)
    .post(`/app/members/invite`, { appId: app.id, displayName, provider })
    .reply(status, response);

export const mockFetchMembersCall = ({
  app,
  status = 200,
  response = data.mockFetchMembersResponse(),
}) =>
  nock(process.env.API_DOMAIN)
    .get(`/app/${app.id}/members`)
    .reply(status, response);

export const mockDeleteMemberCall = ({
  app,
  userId,
  status = 200,
  response = { ok: true },
}) =>
  nock(process.env.API_DOMAIN)
    .delete(`/app/member`, { appId: app.id, userId })
    .reply(status, response);
