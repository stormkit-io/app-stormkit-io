import type { Log } from "~/pages/apps/[id]/environments/[env-id]/deployments/runtime-logs/actions";
import nock from "nock";

const endpoint = process.env.API_DOMAIN || "";

interface FetchDeploymentLogsProps {
  appId: string;
  deploymentId: string;
  status?: number;
  beforeId?: string;
  response: {
    logs: Log[];
    hasNextPage: boolean;
  };
}

export const mockFetchDeploymentLogs = ({
  appId,
  deploymentId,
  status = 200,
  beforeId = "",
  response = {
    logs: [],
    hasNextPage: false,
  },
}: FetchDeploymentLogsProps) => {
  return nock(endpoint)
    .get(
      `/app/${appId}/logs?deploymentId=${deploymentId}${
        beforeId ? `&beforeId=${beforeId}` : ""
      }`
    )
    .reply(status, response);
};
