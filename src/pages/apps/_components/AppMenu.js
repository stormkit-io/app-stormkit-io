import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import Link from "~/components/Link";
import Logo from "~/components/Logo";

const paths = ({ app }) => [
  {
    path: `/apps/${app.id}/environments`,
    text: "Environments",
    icon: "fas fa-th-large"
  },
  {
    path: `/apps/${app.id}/deployments`,
    text: "Deployments",
    icon: "fas fa-ship"
  },
  { path: `/apps/${app.id}/team`, text: "Team", icon: "fas fa-users" },
  { path: `/apps/${app.id}/settings`, text: "Settings", icon: "fas fa-cogs" }
];

const AppMenu = ({ app }) => {
  const url = window?.location.pathname;

  return (
    <div className="flex flex-col h-full p-8 bg-black-o-05">
      <div className="mb-40">
        <Link to="/" alt="Home Page">
          <Logo iconSize={8} />
        </Link>
      </div>
      <ul className="flex-auto">
        {paths({ app }).map(path => (
          <li key={path.text} className="text-sm mb-4 -ml-2">
            <Link
              to={path.path}
              className={cn(
                "inline-flex hover:bg-blue-20 hover:text-white rounded py-2 px-4 items-center",
                {
                  "text-pink-50": url.indexOf(path.path) === 0
                }
              )}
            >
              <span className={cn(path.icon, "mr-4", "text-base", "fa-fw")} />
              {path.text}
            </Link>
          </li>
        ))}
      </ul>
      <div className="-ml-2">
        <Link
          to={"/"}
          className="text-sm inline-flex items-center hover:bg-blue-20 rounded-lg py-2 px-4 hover:text-white"
        >
          <span className="fas fa-arrow-alt-circle-left mr-4" />
          Switch app
        </Link>
      </div>
    </div>
  );
};

AppMenu.propTypes = {
  app: PropTypes.object
};

export default AppMenu;
