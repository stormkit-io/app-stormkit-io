import nock from "nock";
import * as data from "../data";

const endpoint = process.env.API_DOMAIN || "";

interface MockFetchUserResponse {
  user: User | null;
  accounts?: Array<{ provider: Provider; url: string; displayName: string }>;
  ok: boolean;
}

export const mockFetchUser = ({
  status = 200,
  response = data.mockUserResponse(),
}: {
  status?: number;
  response?: MockFetchUserResponse;
}) => nock(endpoint).get("/user").reply(status, response);

interface MockUpdatePersonalAccessTokenProps {
  status?: number;
  response?: { ok: boolean };
  payload: {
    token: string;
  };
}

export const mockUpdatePersonalAccessToken = ({
  payload,
  status = 200,
  response = { ok: true },
}: MockUpdatePersonalAccessTokenProps) =>
  nock(endpoint).put("/user/access-token", payload).reply(status, response);

interface Email {
  address: string;
  verified: boolean;
  primary: boolean;
}

interface MockFetchUserEmailsProps {
  status?: number;
  response: { emails: Email[] };
}

export const mockUseFetchEmails = ({
  status = 200,
  response,
}: MockFetchUserEmailsProps) =>
  nock(endpoint).get("/user/emails").reply(status, response);
