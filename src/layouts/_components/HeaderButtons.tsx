import React, { useContext, useState } from "react";
import { AuthContext } from "~/pages/auth/Auth.context";
import Button from "~/components/ButtonV2";
import SideBar from "~/components/SideBar";
import UserMenu from "~/components/UserMenu";

interface Props {
  children?: React.ReactNode;
}

const HeaderButtons: React.FC<Props> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [isNewsOpen, toggleNews] = useState(false);
  const [isUserMenuOpen, toggleUserMenu] = useState(false);

  if (!user) {
    return <></>;
  }

  return (
    <>
      {children}
      <Button
        styled={false}
        className="p-4"
        onClick={() => {
          toggleUserMenu(false);
          toggleNews(!isNewsOpen);
        }}
      >
        <span className="fas fa-bell text-base" />
      </Button>
      <Button
        className="flex p-4"
        styled={false}
        onClick={() => {
          toggleUserMenu(!isUserMenuOpen);
          toggleNews(false);
        }}
      >
        <img
          src={user.avatar}
          alt={`${user.fullName || user.displayName} profile`}
          className="rounded-full w-7 h-7 inline-block max-w-none"
        />
      </Button>
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
    </>
  );
};

export default HeaderButtons;
