import React, { ReactElement, FC } from "react";
import cn from "classnames";
import Link from "~/components/Link";
import Logo from "~/components/Logo";

interface PathsType {
  path: string,
  text: string,
  icon: string,
}

const paths: PathsType[] = [
  {
    path: "/user/account",
    text: "Account",
    icon: "fas fa-user"
  }
];

const UserMenu: FC = (): ReactElement => {
  const url = window?.location.pathname;

  return (
    <div className="flex flex-col h-full p-8 bg-black-o-05">
      <div className="mb-20">
        <Link to="/" alt="Home Page">
          <Logo iconSize={8} />
        </Link>
      </div>
      <ul className="flex-auto">
        {paths.map(path => (
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
          My apps
        </Link>
      </div>
    </div>
  );
};

export default UserMenu;
