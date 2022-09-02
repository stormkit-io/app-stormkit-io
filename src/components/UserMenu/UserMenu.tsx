import React from "react";
import Link from "~/components/Link";

interface SubItem {
  to: string;
  text: string;
}

interface MenuItem {
  title: string;
  children: Array<SubItem>;
}

const menuItems: Array<MenuItem> = [
  {
    title: "Apps",
    children: [
      { to: "/", text: "My Apps" },
      { to: "/apps/new", text: "New App" },
    ],
  },
  {
    title: "User",
    children: [
      { to: "/user/account", text: "Account" },
      // { to: "/user/referral", text: "Free Credits" }, TODO: Implement this part
      {
        to: "https://www.stormkit.io/docs",
        text: "Docs",
      },
      { to: "/logout", text: "Logout" },
    ],
  },
];

const UserMenu: React.FC = (): React.ReactElement => {
  return (
    <section role="menu" className="text-gray-80 h-full flex flex-col">
      <div className="flex flex-col flex-1">
        {menuItems.map(item => (
          <div className="w-40" key={item.title}>
            <h3 className="uppercase font-bold text-gray-50 mb-6 text-xs">
              {item.title}
            </h3>
            <ul>
              {item.children.map(link => (
                <li key={link.text}>
                  <Link
                    to={link.to}
                    className="mb-6 block text-xs text-gray-80"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
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
