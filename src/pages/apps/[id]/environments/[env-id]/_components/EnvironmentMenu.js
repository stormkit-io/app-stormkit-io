import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import Link from "~/components/Link";
import { BackButton } from "~/components/Buttons";
import Env from "~/pages/apps/[id]/environments/_components/Environment";

const menuItems = [
  { icon: "far fa-chart-bar", text: "Logs", path: "/logs" },
  { icon: "fas fa-code", text: "Snippets", path: "/snippets" },
  { icon: "fas fa-flag", text: "Feature Flags", path: "/feature-flags" },
  { icon: "fas fa-globe", text: "Configure domain", path: "/domain" },
];

const EnvironmentMenu = ({ environment, app }) => {
  const url = `/apps/${app.id}/environments/${environment.id}`;
  const path = window?.location?.pathname;

  return (
    <div>
      <h1 className="mb-8 flex items-center">
        <BackButton to={`/apps/${app.id}/environments`} className="mr-4" />
        <span className="text-2xl text-white">Environments</span>
      </h1>
      <div className="flex">
        <Env app={app} environment={environment} />
        <nav className="flex flex-col bg-white rounded ml-4 md:min-w-1/3 md:max-w-1/3 px-4 py-6">
          {menuItems.map(i => (
            <Link
              to={`${url}${i.path}`}
              className={cn(
                "text-primary text-sm flex items-center hover:bg-gray-75 p-2 rounded-lg",
                {
                  "text-pink-50": path.indexOf(i.path) > -1,
                  "bg-gray-90": path.indexOf(i.path) > -1,
                }
              )}
              key={i.path}
            >
              <span className="icon-bg bg-gray-90 mr-4">
                <i className={`${i.icon} fa-fw`} />
              </span>
              {i.text}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

EnvironmentMenu.propTypes = {
  environment: PropTypes.object,
};

export default EnvironmentMenu;
