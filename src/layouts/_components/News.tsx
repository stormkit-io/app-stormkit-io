
import React, { useState } from "react";
import cn from "classnames";
import Link from "~/components/Link";
import OutsideClick from "~/components/OutsideClick";
import { Box, Popper } from "@material-ui/core";
import CampaignIcon from '@mui/icons-material/Campaign';


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

const News: React.FC = (): React.ReactElement => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    function handleClick(event: any) {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    }

      const open = Boolean(anchorEl);
      console.log("fucking open", open, anchorEl)
      const id = open ? 'simple-popper' : undefined;

  return (
   <OutsideClick handler={() => setAnchorEl(null)}>

    <div>
      <button aria-describedby={id} className="p-2" onClick={handleClick}>
          <span className="fa-solid fa-bullhorn fa-lg hover:text-white" />
      </button>
      <Popper id={id} open={open} anchorEl={anchorEl}  placement="bottom-end">
        <div className="bg-white" >
        <iframe className="h-96" style={{"width":"38rem"}} src="https://www.stormkit.io/blog/whats-new"/>
        </div>
      </Popper>
    </div>
     </OutsideClick>
  );
};

export default News;
