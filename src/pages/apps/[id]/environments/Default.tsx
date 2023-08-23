import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AppContext } from "~/pages/apps/[id]/App.context";

const Environments: React.FC = (): React.ReactElement => {
  const { environments, app } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    navigate(
      `/apps/${app.id}/environments/${
        environments.find(e => e.name === "production")?.id
      }/deployments`,
      { replace: true }
    );
  }, [navigate]);

  return <></>;
};

export default Environments;
