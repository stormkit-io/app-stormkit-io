import React from "react";
import cn from "classnames";
import Link from "~/components/Link";
import { LS_PROVIDER } from "~/utils/api/Api";
import { LocalStorage } from "~/utils/storage";

interface MenuItem {
  to: string;
  text: string;
}

const menuItems: Array<MenuItem> = [
  { to: "/", text: "My Apps" },
  { to: `/apps/new/${LocalStorage.get(LS_PROVIDER)}`, text: "New App" },
  { to: "/user/account", text: "Account" },
  // { to: "/user/referral", text: "Free Credits" }, TODO: Implement this part
  {
    to: "https://www.stormkit.io/docs",
    text: "Docs",
  },
  { to: "/logout", text: "Logout" },
];

interface Props {
  className?: string | string[] | Record<string, unknown>;
}

const UserMenu: React.FC<Props> = ({ className }): React.ReactElement => {
  return (
    <section role="menu" className={cn("h-full flex flex-col", className)}>
      <div className="flex flex-col flex-1">
        {menuItems.map(item => (
          <div className="w-40" key={item.text}>
            <Link to={item.to} className="mb-6 block text-xs">
              {item.text}
            </Link>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-80 border-solid pt-4 leading-relaxed text-center">
        <p className="text-xl">
          <a
            target="_blank"
            rel="noreferrer nooopener"
            href="https://twitter.com/stormkitio"
            className="mr-4"
          >
            <span className="fab fa-twitter" />
          </a>
          <a
            target="_blank"
            rel="noreferrer nooopener"
            href="https://www.youtube.com/channel/UC6C_-UuAiIWlGOIokT03lRQ"
            className="mr-4"
          >
            <span className="fab fa-youtube" />
          </a>
          <a
            target="_blank"
            rel="noreferrer nooopener"
            href="https://discord.gg/6yQWhyY"
            className="mr-4"
          >
            <span className="fab fa-discord" />
          </a>
          <a
            target="_blank"
            rel="noreferrer nooopener"
            href="mailto:hello@stormkit.io"
            className="mr-4"
          >
            <span className="fa fa-envelope" />
          </a>
        </p>
        <p className="inline-flex items-center text-xs">
          &copy; {new Date().getFullYear()} Stormkit, Inc. - all rights
          reserved.
        </p>
        <p className="text-xs">
          Made with <span className="fas fa-heart text-pink-50" />
        </p>
      </div>
    </section>
  );
};

export default UserMenu;
