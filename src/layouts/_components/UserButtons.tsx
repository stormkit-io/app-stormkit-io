import React, { useContext, useState } from "react";
import { AuthContext } from "~/pages/auth/Auth.context";
import { Notifications } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ClickAwayListener from "@mui/base/ClickAwayListener";
import SideBar from "~/components/SideBar";
import UserMenu from "~/components/UserMenu";
import Spinner from "~/components/Spinner";

const UserButtons: React.FC = () => {
  const theme = useTheme();
  const { user } = useContext(AuthContext);
  const [isNewsOpen, toggleNews] = useState(false);
  const [isUserMenuOpen, toggleUserMenu] = useState(false);
  const [isFrameLoaded, setIsFrameLoaded] = useState(false);

  if (!user) {
    return <></>;
  }

  return (
    <>
      <ClickAwayListener
        onClickAway={() => {
          toggleNews(false);
        }}
      >
        <Tooltip title="What's new?" placement="bottom" arrow>
          <IconButton
            onClick={() => {
              toggleUserMenu(false);
              toggleNews(!isNewsOpen);
            }}
          >
            <Notifications />
          </IconButton>
        </Tooltip>
      </ClickAwayListener>

      <Tooltip
        title={
          <ClickAwayListener
            onClickAway={() => {
              toggleUserMenu(false);
            }}
          >
            <div>
              <UserMenu className="p-4" onClick={() => toggleUserMenu(false)} />
            </div>
          </ClickAwayListener>
        }
        placement="bottom-end"
        open={isUserMenuOpen}
        arrow
      >
        <IconButton
          onClick={() => {
            toggleUserMenu(!isUserMenuOpen);
            toggleNews(false);
          }}
        >
          <Box
            component="img"
            sx={{ borderRadius: "50%", w: 24, height: 24, maxWidth: "none" }}
            src={user.avatar}
            alt={`${user.fullName || user.displayName} profile`}
          />
        </IconButton>
      </Tooltip>

      <SideBar isOpen={isNewsOpen}>
        <Box sx={{ position: "relative", height: "100%" }}>
          {(isNewsOpen || isFrameLoaded) && (
            <Box
              component="iframe"
              onLoad={() => {
                setIsFrameLoaded(true);
              }}
              sx={{
                position: "relative",
                visibility: isFrameLoaded ? "visible" : "hidden",
                zIndex: 2,
                width: "100%",
                height: "100%",
                bgcolor: theme.palette.background.default,
              }}
              src="https://www.stormkit.io/blog/whats-new?ui=no-menu,no-footer,no-posts,no-header"
            />
          )}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1,
            }}
          >
            <Spinner />
          </Box>
        </Box>
      </SideBar>
    </>
  );
};

export default UserButtons;
