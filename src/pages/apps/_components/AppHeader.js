import React from "react";
import PropTypes from "prop-types";
import { formattedDate } from "~/utils/helpers/deployments";
import AppHeaderActions from "./AppHeaderActions";

const AppHeader = ({ app, envs, api, history }) => {
  const provider = app.repo.split("/").shift();

  return (
    <header className="flex w-full mt-6">
      <div className="flex items-center pt-1">
        <span className={`fab fa-${provider} text-white mr-6 text-5xl`} />
        <div className="flex flex-col">
          <div className="text-white mb-1">{app.name}</div>
          <div className="text-secondary text-sm">
            Last deploy: {formattedDate(app.deployedAt)}
            <span
              className={`inline-block ml-2 w-2 h-2 rounded-full bg-${
                app.status ? "green-50" : "red-50"
              }`}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-auto items-center justify-end">
        <AppHeaderActions
          app={app}
          api={api}
          history={history}
          environments={envs}
        />
      </div>
    </header>
  );
};

AppHeader.propTypes = {
  api: PropTypes.object,
  app: PropTypes.object,
  envs: PropTypes.array,
  actions: PropTypes.node,
  history: PropTypes.object
};

export default AppHeader;
