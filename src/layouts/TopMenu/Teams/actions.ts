import api from "~/utils/api/Api";

interface CreateTeamProps {
  teamId?: string;
  name: string;
}

export const upsertTeam = ({
  name,
  teamId,
}: CreateTeamProps): Promise<Team> => {
  if (teamId) {
    return api.patch<Team>("/team", { name, teamId });
  }

  return api.post<Team>("/team", { name });
};
