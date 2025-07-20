import nock from "nock";

const endpoint = process.env.API_DOMAIN || "";

export const mockStatsData = {
  totalApps: {
    total: 25,
    new: 5,
    deleted: 2,
  },
  totalDeployments: {
    total: 150,
    current: 30,
    previous: 25,
  },
  avgDeploymentDuration: {
    current: 125.5,
    previous: 170.2,
  },
  totalRequests: {
    current: 10000,
    previous: 8500,
  },
};

interface FetchTeamStatsProps {
  teamId?: string;
  status?: number;
  response?: typeof mockStatsData;
}

export const mockFetchTeamStats = ({
  teamId,
  status = 200,
  response = mockStatsData,
}: FetchTeamStatsProps) => {
  return nock(endpoint)
    .get(`/team/stats?teamId=${teamId}`)
    .reply(status, response);
};
