import React from "react";
import { Redirect, useRouteMatch } from "react-router-dom";

interface RouteParams {
  id: string;
}

const Id: React.FC = (): React.ReactElement => {
  const match = useRouteMatch<RouteParams>();
  return <Redirect to={`/apps/${match.params.id}/environments`} />;
};

export default Id;
