import nock from "nock";

const endpoint = process.env.API_DOMAIN || "";

interface MockFetchUsageProps {
  appId: string;
  status?: number;
  response?: {
    numberOfDeploymentsThisMonth: number;
    remainingDeploymentsThisMonth: number;
  };
}

export const mockFetchUsage = ({
  appId,
  status = 200,
  response,
}: MockFetchUsageProps) =>
  nock(endpoint).get(`/app/${appId}/usage`).reply(status, response);
