import type { Installation } from "~/utils/api/Github";
import qs from "query-string";
import nock from "nock";

const endpoint = process.env.API_DOMAIN || "";

interface FetchRepositoriesProps {
  installationId: string;
  query: Record<string, unknown>;
  status?: number;
  response: {
    total_count: number;
    repositories: { name: string; full_name: string }[];
  };
}

export const mockFetchRepositories = ({
  installationId,
  query,
  status = 200,
  response,
}: FetchRepositoriesProps) => {
  const params = qs.stringify(query);
  return nock(endpoint)
    .get(`/user/installations/${installationId}/repositories?${params}`)
    .reply(status, response);
};

interface FetchInstallationsProps {
  page?: number;
  status?: number;
  response: {
    total_count: number;
    installations: Installation[];
  };
}

export const mockFetchInstallations = ({
  page = 1,
  status = 200,
  response,
}: FetchInstallationsProps) => {
  return nock(endpoint)
    .get(`/user/installations?page=${page}&per_page=25`)
    .reply(status, response);
};
