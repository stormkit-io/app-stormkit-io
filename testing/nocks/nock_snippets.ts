import nock from "nock";

const endpoint = process.env.API_DOMAIN || "";

interface MockFetchSnippetsProps {
  appId: string;
  envId: string;
  status?: number;
  response: { snippets: Snippet[] };
}

export const mockFetchSnippets = ({
  appId,
  envId,
  status = 200,
  response,
}: MockFetchSnippetsProps) => {
  return nock(endpoint)
    .get(`/snippets?appId=${appId}&envId=${envId}`)
    .reply(status, response);
};

interface MockInsertSnippetsProps {
  appId: string;
  envId: string;
  snippets: any[];
  status?: number;
  response?: { ok: true };
}

export const mockInsertSnippet = ({
  snippets,
  envId,
  appId,
  status = 200,
  response = { ok: true },
}: MockInsertSnippetsProps) => {
  const url = "/snippets";
  const params = {
    appId,
    envId,
    snippets,
  };

  return nock(endpoint).post(url, params).reply(status, response);
};

interface MockUpdateSnippetProps {
  appId: string;
  envId: string;
  snippet: any;
  status?: number;
  response?: { ok: true };
}

export const mockUpdateSnippet = ({
  snippet,
  envId,
  appId,
  status = 200,
  response = { ok: true },
}: MockUpdateSnippetProps) => {
  const url = "/snippets";
  const params = {
    appId,
    envId,
    snippet,
  };

  return nock(endpoint).put(url, params).reply(status, response);
};
