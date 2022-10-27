import type { Log } from "~/pages/apps/[id]/environments/[env-id]/deployments/runtime-logs/actions";
import nock from "nock";

const endpoint = process.env.API_DOMAIN || "";

interface FetchDeploymentLogsProps {
  appId: string;
  deploymentId: string;
  status?: number;
  response: {
    logs: Log[];
    totalPage: number
  };
}

export const mockFetchDeploymentLogs = ({
  appId,
  deploymentId,
  status = 200,
  response = {
    logs: [],
  },
}: FetchDeploymentLogsProps) => {
  return nock(endpoint)
    .get(`/app/${appId}/logs?deploymentId=${deploymentId}`)
    .reply(status, response);
};
