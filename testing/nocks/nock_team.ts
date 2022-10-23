import type { Member } from "~/pages/apps/[id]/team/actions";
import nock from "nock";

const endpoint = process.env.API_DOMAIN || "";

interface MockInviteMemberProps {
  appId: string;
  displayName: string;
  provider: Provider;
  status?: number;
  response: { token: string };
}

export const mockInviteMember = ({
  appId,
  displayName,
  provider,
  status = 200,
  response,
}: MockInviteMemberProps) =>
  nock(endpoint)
    .post(`/app/members/invite`, { appId, displayName, provider })
    .reply(status, response);

interface MockFetchMembersProps {
  appId: string;
  status?: number;
  response: { members: Member[] };
}

export const mockFetchMembers = ({
  appId,
  status = 200,
  response,
}: MockFetchMembersProps) =>
  nock(endpoint).get(`/app/${appId}/members`).reply(status, response);

interface MockDeleteMemberProps {
  appId: string;
  userId: string;
  status?: number;
  response: { ok: boolean };
}

export const mockDeleteMember = ({
  appId,
  userId,
  status = 200,
  response = { ok: true },
}: MockDeleteMemberProps) =>
  nock(endpoint)
    .delete(`/app/member`, { appId, userId })
    .reply(status, response);
