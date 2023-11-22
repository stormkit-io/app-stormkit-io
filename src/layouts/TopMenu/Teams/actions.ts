import { useMemo } from "react";
import { useParams } from "react-router-dom";
import api from "~/utils/api/Api";

interface CreateTeamProps {
  name: string;
}

export const createTeam = ({ name }: CreateTeamProps): Promise<Team> => {
  return api.post<Team>("/team", { name });
};

interface UseSelectedTeamProps {
  teams?: Team[];
  app?: App;
}

export const useSelectedTeam = ({
  teams,
  app,
}: UseSelectedTeamProps): Team | undefined => {
  const params = useParams();

  return useMemo(
    () =>
      teams?.find(
        t =>
          // The slug matches team id, team slug or app's teamId.
          t.slug === params.team || app?.teamId === t.id || params.team === t.id
      ) || teams?.find(t => t.isDefault),
    [teams, params, app]
  );
};
