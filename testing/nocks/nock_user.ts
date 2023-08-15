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

export const mockUpdatePersonalAccessToken = ({
  status = 200,
  payload = {},
  response = { ok: true },
}) => nock(endpoint).put("/user/access-token", payload).reply(status, response);
