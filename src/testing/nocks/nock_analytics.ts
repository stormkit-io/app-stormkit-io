import nock from "nock";

const endpoint = process.env.API_DOMAIN || "";

interface MockFetchVisitorsProps {
  ts?: "24h" | "7d" | "30d";
  unique?: "true" | "false";
  envId?: string;
  domainId: string;
  status?: number;
  response?: Record<string, { total: number; unique: number }>;
}

export const mockFetchVisitors = ({
  unique,
  ts,
  envId,
  status = 200,
  domainId,
  response,
}: MockFetchVisitorsProps) => {
  return nock(endpoint)
    .get(
      `/analytics/visitors?unique=${unique}&envId=${envId}&ts=${ts}&domainId=${domainId}`
    )
    .reply(status, response);
};
