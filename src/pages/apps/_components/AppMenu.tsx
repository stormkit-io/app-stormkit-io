import React from "react";
import cn from "classnames";
import Link from "~/components/Link";
import Logo from "~/components/Logo";

interface Props {
  app: App;
}

interface Path {
  path: string;
  text: string;
  icon: string;
}

const paths = ({ app }: Props): Array<Path> => [
  {
    path: `/apps/${app.id}/environments`,
    text: "Environments",
    icon: "fas fa-th-large",
  },
  {
    path: `/apps/${app.id}/deployments`,
    text: "Deployments",
    icon: "fas fa-ship",
  },
  { path: `/apps/${app.id}/team`, text: "Team", icon: "fas fa-users" },
  { path: `/apps/${app.id}/settings`, text: "Settings", icon: "fas fa-cogs" },
  { path: `/apps/${app.id}/usage`, text: "Usage", icon: "fas fa-money-bill" },
];

const AppMenu: React.FC<Props> = ({ app }): React.ReactElement => {
  const url = window?.location.pathname;
  return (
    <div className="flex flex-col h-full py-8 pl-8 lg:pr-8 bg-black-o-05">
      <div className="mb-40">
        <Link to="/" alt="Home Page" className="hidden lg:inline-block">
          <Logo iconSize={8} />
        </Link>
        <Link to="/" alt="Home Page" className="inline-block lg:hidden">
          <Logo iconSize={8} iconOnly />
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
                  "text-pink-50": url.indexOf(path.path) === 0,
                }
              )}
            >
              <span
                className={cn(path.icon, "lg:mr-4", "text-base", "fa-fw")}
              />
              <span className="hidden lg:inline-block">{path.text}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="-ml-2">
        <Link
          to={"/"}
          className="text-sm inline-flex items-center hover:bg-blue-20 rounded-lg py-2 px-4 hover:text-white"
        >
          <span className="fas fa-arrow-alt-circle-left lg:mr-4" />
          <span className="hidden lg:inline-block">Switch app</span>
        </Link>
      </div>
    </div>
  );
};

export default AppMenu;
