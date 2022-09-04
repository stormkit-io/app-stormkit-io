import React, { useContext, useState } from "react";
import cn from "classnames";
import Logo from "~/components/Logo";
import Button from "~/components/ButtonV2";
import SideBar from "~/components/SideBar";
import UserMenu from "~/components/UserMenu";
import { AuthContext } from "~/pages/auth/Auth.context";

interface Props {
  children: React.ReactNode;
}

const DefaultLayout: React.FC<Props> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [isNewsOpen, toggleNews] = useState(false);
  const [isUserMenuOpen, toggleUserMenu] = useState(false);

  return (
    <main
      className={cn("flex flex-col min-h-screen m-auto items-center w-full", {
        "justify-center": !user,
      })}
    >
      {user && (
        <header className="flex flex-0 w-full p-4">
          <div className="flex flex-1 items-center">
            <Logo iconOnly iconSize={8} />
          </div>
          <div className="flex items-center text-white">
            <Button
              styled={false}
              className="px-2 mr-2"
              onClick={() => {
                toggleUserMenu(false);
                toggleNews(!isNewsOpen);
              }}
            >
              <span className="fas fa-bell text-base" />
            </Button>
            <Button
              className="flex"
              styled={false}
              onClick={() => {
                toggleUserMenu(!isUserMenuOpen);
                toggleNews(false);
              }}
            >
              <img
                src={user.avatar}
                alt={`${user.fullName || user.displayName} profile`}
                className="rounded-full w-8 h-8 inline-block max-w-none"
              />
            </Button>
          </div>
          <SideBar isOpen={isNewsOpen} maxWidth="max-w-128">
            {isNewsOpen && (
              <iframe
                className="h-full w-full bg-white"
                src="https://www.stormkit.io/blog/whats-new?ui=no-menu,no-footer,no-posts,no-header"
              />
            )}
          </SideBar>
          <SideBar isOpen={isUserMenuOpen}>
            <UserMenu />
          </SideBar>
        </header>
      )}
      {children}
    </main>
  );
};

export default DefaultLayout;
