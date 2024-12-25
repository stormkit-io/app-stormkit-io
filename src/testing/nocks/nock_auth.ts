import nock from "nock";

const endpoint = process.env.API_DOMAIN || "";

interface MockFetchAuthProviders {
  status?: number;
  response?: Record<string, bool>;
}

export const mockFetchAuthProviders = ({
  status = 200,
  response,
}: MockFetchAuthProviders) => {
  return nock(endpoint).get(`/auth/providers`).reply(status, response);
};
