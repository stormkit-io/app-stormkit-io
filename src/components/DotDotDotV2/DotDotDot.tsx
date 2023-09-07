import React, { useState } from "react";
import cn from "classnames";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import Button from "~/components/ButtonV2";

interface Item {
  text: React.ReactNode;
  href?: string;
  icon?: string | React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (close?: () => void) => boolean | void;
}

interface Props {
  items: Item[];
}

const DotDotDot: React.FC<Props> = ({ items }) => {
  const [isOpen, toggleIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <Button styled={false} onClick={() => toggleIsOpen(!isOpen)}>
        <span
          className="fas fa-ellipsis-h cursor-pointer"
          aria-label="expand"
        />
      </Button>
    );
  }

  return (
    <Tooltip
      placement="bottom-end"
      open={isOpen}
      arrow
      classes={{
        tooltip:
          "bg-blue-50 custom-tooltip p-0 text-sm border border-blue-10 shadow text-gray-80",
        arrow: "text-blue-50",
      }}
      title={
        <ClickAwayListener onClickAway={() => toggleIsOpen(false)}>
          <div className="flex flex-col">
            {items.map((item, index) => (
              <div key={index}>
                <Button
                  styled={false}
                  align="left"
                  href={item.href}
                  disabled={item.disabled}
                  onClick={() => {
                    if (item.onClick?.(() => toggleIsOpen(false)) !== false) {
                      toggleIsOpen(false);
                    }
                  }}
                  className={cn(
                    "px-4 py-3 text-left min-w-48 flex items-center",
                    item.className,
                    {
                      "border-b border-blue-30 ": index < items.length - 1,
                      "hover:bg-blue-20": !item.disabled,
                      "opacity-50 cursor-default": item.disabled,
                    }
                  )}
                >
                  {typeof item.icon === "string" && (
                    <span className={cn(item.icon, "mr-2 fa-fw")} />
                  )}
                  {typeof item.icon === "object" && (
                    <Box
                      component="span"
                      sx={{
                        scale: "0.75",
                        display: "inline-flex",
                        alignItems: "center",
                      }}
                    >
                      <IconButton size="small" sx={{ p: 0, m: 0, mr: 1 }}>
                        {item.icon}
                      </IconButton>
                    </Box>
                  )}
                  {item.text}
                </Button>
              </div>
            ))}
          </div>
        </ClickAwayListener>
      }
    >
      <div>
        <Button styled={false} onClick={() => toggleIsOpen(!isOpen)}>
          <span className="fas fa-ellipsis-h cursor-pointer" />
        </Button>
      </div>
    </Tooltip>
  );
};

export default DotDotDot;
