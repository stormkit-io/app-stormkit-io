import React from "react";
import { Redirect, useRouteMatch } from "react-router-dom";

interface MatchParams {
  id: string;
}

const Id = (): React.ReactElement => {
  const match = useRouteMatch<MatchParams>();
  // For now redirect to the environments page.
  // In the future we can create a dashboard here.
  return <Redirect to={`/apps/${match.params.id}/environments`} />;
};

export default Id;
