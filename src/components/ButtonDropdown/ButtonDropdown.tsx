import React, { useState } from "react";
import Button from "@mui/material/Button";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import ArrowDropUp from "@mui/icons-material/ArrowDropUp";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ClickAwayListener from "@mui/base/ClickAwayListener";

interface MenuItemProps {
  text: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: React.MouseEventHandler;
}

interface Props {
  buttonText: string;
  children?: React.ReactNode;
  items?: MenuItemProps[];
}

export default function ButtonDropdown({ buttonText, children, items }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <ClickAwayListener
      onClickAway={() => {
        setIsMenuOpen(false);
      }}
    >
      <Tooltip
        title={
          children || (
            <MenuList sx={{ minWidth: 250 }}>
              {items?.map(item => {
                return (
                  <MenuItem
                    key={item.href || item.text}
                    sx={{
                      mb: 1,
                      ":last-child": {
                        mb: 0,
                      },
                    }}
                  >
                    <Link
                      href={item.href || "#"}
                      onClick={item.onClick}
                      sx={{
                        color: "white",
                        ":hover": { color: "white" },
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                      {item.text}
                    </Link>
                  </MenuItem>
                );
              })}
            </MenuList>
          )
        }
        placement="bottom-end"
        open={isMenuOpen}
        arrow
      >
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
          }}
          sx={{ pr: 0.5 }}
        >
          {buttonText}{" "}
          {isMenuOpen ? (
            <ArrowDropUp sx={{ ml: 0.5 }} />
          ) : (
            <ArrowDropDown sx={{ ml: 0.5 }} />
          )}
        </Button>
      </Tooltip>
    </ClickAwayListener>
  );
}
