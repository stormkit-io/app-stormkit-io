import nock from "nock";

const endpoint = process.env.API_DOMAIN || "";

interface SnippetAPI extends Omit<Snippet, "_injectLocation" | "_i"> {}

interface MockFetchSnippetsProps {
  appId: string;
  envName: string;
  status?: number;
  response: { snippets: { head: SnippetAPI[]; body: SnippetAPI[] } };
}

export const mockFetchSnippets = ({
  appId,
  envName,
  status = 200,
  response,
}: MockFetchSnippetsProps) => {
  return nock(endpoint)
    .get(`/app/${appId}/envs/${envName}/snippets`)
    .reply(status, response);
};

interface MockUpsertSnippetsProps {
  appId: string;
  envName: string;
  snippets: { head: SnippetAPI[]; body: SnippetAPI[] };
  status?: number;
  response?: { ok: true };
}

export const mockUpsertSnippets = ({
  snippets,
  envName,
  appId,
  status = 200,
  response = { ok: true },
}: MockUpsertSnippetsProps) => {
  return nock(endpoint)
    .put(`/app/env/snippets`, {
      appId,
      env: envName,
      snippets,
    })
    .reply(status, response);
};
