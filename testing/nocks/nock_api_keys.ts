import nock from "nock";
import * as data from "../data";

const endpoint = process.env.API_DOMAIN || "";

interface MockFetchAPIKeysProps {
  appId: string;
  envId: string;
  status?: number;
  response?: { keys: APIKey[] };
}

export const mockFetchAPIKeys = ({
  appId,
  envId,
  status = 200,
  response = data.mockAPIKeysResponse(),
}: MockFetchAPIKeysProps) => {
  return nock(endpoint)
    .get(`/app/${appId}/env/${envId}/api-keys`)
    .reply(status, response);
};

interface MockDeleteAPIKeyProps {
  appId: string;
  envId: string;
  keyId: string;
  status?: number;
}

export const mockDeleteAPIKey = ({
  appId,
  envId,
  keyId,
  status = 200,
}: MockDeleteAPIKeyProps) => {
  return nock(endpoint)
    .delete(`/app/${appId}/env/${envId}/api-key?keyId=${keyId}`)
    .reply(status, { ok: true });
};
