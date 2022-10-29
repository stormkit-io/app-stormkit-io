import type { Log } from "~/pages/apps/[id]/environments/[env-id]/deployments/runtime-logs/actions";
import nock from "nock";

const endpoint = process.env.API_DOMAIN || "";

interface FetchDeploymentLogsProps {
  appId: string;
  deploymentId: string;
  status?: number;
  page?: number;
  response: {
    logs: Log[];
    totalPage: number;
  };
}

export const mockFetchDeploymentLogs = ({
  appId,
  deploymentId,
  status = 200,
  page = 0,
  response = {
    logs: [],
    totalPage: 0,
  },
}: FetchDeploymentLogsProps) => {
  return nock(endpoint)
    .get(`/app/${appId}/logs?deploymentId=${deploymentId}&page=${page}`)
    .reply(status, response);
};
