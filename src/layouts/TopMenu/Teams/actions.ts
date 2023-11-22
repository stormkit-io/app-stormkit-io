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
  const findDefaultTeam = () => teams?.find(t => t.isDefault);

  const team = useMemo(() => {
    if (params.team) {
      return teams?.find(t => t.slug === params.team || t.id === params.id);
    }

    if (app?.teamId) {
      return teams?.find(t => t.id === app.teamId);
    }

    if (location.pathname == "/") {
      return findDefaultTeam();
    }

    const teamId = localStorage.getItem("teamId");

    if (teamId) {
      return teams?.find(t => t.id === teamId);
    }
  }, [teams, params, app]);

  if (team) {
    localStorage.setItem("teamId", team.id);
  }

  return team || findDefaultTeam();
};
