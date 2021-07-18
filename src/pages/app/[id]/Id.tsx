import React from "react";
import { Redirect, useRouteMatch } from "react-router-dom";

interface MatchParams {
  id: string;
}

const Id = (): React.ReactElement => {
  const match = useRouteMatch<MatchParams>();
  return <Redirect to={`/apps/${match.params.id}`} />;
};

export default Id;
