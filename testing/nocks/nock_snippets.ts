import nock from "nock";

const endpoint = process.env.API_DOMAIN || "";

interface MockFetchSnippetsProps {
  appId: string;
  envId: string;
  status?: number;
  response: { snippets: { head: Snippet[]; body: Snippet[] } };
}

export const mockFetchSnippets = ({
  appId,
  envId,
  status = 200,
  response,
}: MockFetchSnippetsProps) => {
  return nock(endpoint)
    .get(`/app/env/snippets?appId=${appId}&envId=${envId}`)
    .reply(status, response);
};

interface MockUpsertSnippetsProps {
  appId: string;
  envId: string;
  snippets: any[];
  status?: number;
  method: "post" | "put";
  response?: { ok: true };
}

export const mockUpsertSnippets = ({
  snippets,
  envId,
  appId,
  method,
  status = 200,
  response = { ok: true },
}: MockUpsertSnippetsProps) => {
  const url = "/app/env/snippets";
  const params = {
    appId,
    envId,
    snippets,
  };

  if (method === "post") {
    return nock(endpoint).post(url, params).reply(status, response);
  }

  return nock(endpoint).put(url, params).reply(status, response);
};
