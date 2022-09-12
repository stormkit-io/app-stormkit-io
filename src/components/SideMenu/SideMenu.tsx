import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Tooltip } from "@mui/material";
import cn from "classnames";
import Logo from "~/components/Logo";
import Link from "~/components/Link";

interface MenuItem {
  text: string;
  path: string;
  icon: string;
  children?: MenuItem[];
  borderBottom?: boolean;
}

interface Props {
  menuItems: MenuItem[];
  children?: React.ReactNode;
}

interface SubmenuItemProps {
  item: MenuItem;
  pathname: string;
}

const SubmenuItem: React.FC<SubmenuItemProps> = ({ item, pathname }) => {
  if (!item.path) {
    return (
      <span className="block p-4 text-center border-b border-blue-30">
        {item.text}
      </span>
    );
  }

  return (
    <Link
      to={item.path}
      className={cn("block p-4 hover:text-white hover:bg-blue-30", {
        "bg-blue-20":
          pathname === item.path && !pathname.endsWith("/environments"),
      })}
    >
      {item.icon && <span className={cn(item.icon, "mr-4 fa-fw")} />}
      {item.text}
    </Link>
  );
};

const SideMenu: React.FC<Props> = ({ menuItems, children }) => {
  const { pathname } = useLocation();
  const [activeTooltip, setActiveTooltip] = useState<string>();

  return (
    <nav className="fixed left-0 top-0 bottom-0 text-gray-80 side-menu">
      <div className="flex flex-col h-full bg-blue-50">
        <ul className="flex-1" onMouseLeave={() => setActiveTooltip("")}>
          <li className="p-4 border-blue-10 border-b">
            <Link to="/">
              <Logo iconOnly iconSize={8} />
            </Link>
          </li>
          {menuItems.map(item => (
            <Tooltip
              open={activeTooltip === item.text}
              title={(item.children || [{ ...item, icon: "" }]).map(c => (
                <SubmenuItem key={c.path} item={c} pathname={pathname} />
              ))}
              arrow
              placement={item.children ? "right-start" : "right"}
              key={item.text}
              classes={{
                tooltip: "bg-blue-50 custom-tooltip p-0 text-sm",
                arrow: "text-blue-50",
              }}
            >
              <li
                onMouseEnter={() => setActiveTooltip(item.text)}
                className={cn("text-center text-lg hover:bg-blue-30", {
                  "border-b border-blue-10": item.borderBottom,
                  "bg-blue-20 text-white": pathname.includes(item.path),
                })}
              >
                <Link to={item.path} className="hover:text-white p-4 block">
                  <span className={item.icon} />
                </Link>
              </li>
            </Tooltip>
          ))}
        </ul>
        {children}
      </div>
    </nav>
  );
};

export default SideMenu;
