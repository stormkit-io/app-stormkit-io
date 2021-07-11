import React, { useState } from "react";
import cn from "classnames";
import Link from "~/components/Link";
import OutsideClick from "~/components/OutsideClick";

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
  {
    title: "Get in touch",
    children: [
      {
        to: "https://discord.gg/6yQWhyY",
        text: "Discord",
      },
      { to: "mailto:hello@stormkit.io", text: "Email" },
    ],
  },
  {
    title: "Legal",
    children: [
      {
        to: "https://www.stormkit.io/policies/privacy",
        text: "Privacy Policy",
      },
      {
        to: "https://www.stormkit.io/policies/terms",
        text: "Terms of Service",
      },
    ],
  },
];

const UserMenu: React.FC = (): React.ReactElement => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <OutsideClick handler={() => setIsMenuOpen(false)}>
      <nav>
        <button className="p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className="fas fa-bars text-2xl text-secondary hover:text-white" />
          <span className="hidden">Menu</span>
        </button>
        <section
          role="menu"
          className={cn(
            "flex flex-col absolute right-0 shadow-2xl p-8 rounded bg-white border border-black z-10",
            {
              hidden: !isMenuOpen,
            }
          )}
        >
          <div className="flex">
            {menuItems.map(item => (
              <div className="w-40" key={item.title}>
                <h3 className="uppercase font-bold text-gray-70 mb-6 text-xs">
                  {item.title}
                </h3>
                <ul>
                  {item.children.map(link => (
                    <li key={link.text}>
                      <Link
                        to={link.to}
                        tertiary
                        className="mb-6 block uppercase text-xs"
                      >
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-80 border-solid pt-6 mt-12 leading-relaxed text-center">
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
              >
                <span className="fab fa-youtube" />
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
      </nav>
    </OutsideClick>
  );
};

export default UserMenu;
