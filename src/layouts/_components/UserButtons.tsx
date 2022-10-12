import React, { useContext, useState } from "react";
import { AuthContext } from "~/pages/auth/Auth.context";
import Button from "~/components/ButtonV2";
import SideBar from "~/components/SideBar";
import UserMenu from "~/components/UserMenu";
import { Tooltip } from "@mui/material";

const UserButtons: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [isNewsOpen, toggleNews] = useState(false);
  const [isUserMenuOpen, toggleUserMenu] = useState(false);

  if (!user) {
    return <></>;
  }

  return (
    <>
      <Tooltip
        title={
          <Button
            className="p-4 block"
            type="button"
            onClick={() => {
              toggleUserMenu(false);
              toggleNews(!isNewsOpen);
            }}
            styled={false}
          >
            What's new?
          </Button>
        }
        placement="right"
        arrow
        classes={{
          tooltip: "bg-blue-50 custom-tooltip text-sm",
          arrow: "text-blue-50",
        }}
      >
        <div className="text-center">
          <Button
            styled={false}
            className="p-2 md:p-4"
            type="button"
            onClick={() => {
              toggleUserMenu(false);
              toggleNews(!isNewsOpen);
            }}
          >
            <span className="fas fa-bell text-base" />
          </Button>
        </div>
      </Tooltip>
      <Button
        className="hidden md:flex p-2 md:p-4"
        styled={false}
        type="button"
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

export default UserButtons;
