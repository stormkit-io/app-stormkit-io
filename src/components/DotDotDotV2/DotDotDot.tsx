import React, { useState } from "react";
import cn from "classnames";
import { Tooltip } from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Button from "~/components/ButtonV2";

interface Item {
  text: React.ReactNode;
  href?: string;
  icon?: string;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
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
                    item.onClick?.();
                    toggleIsOpen(false);
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
                  {item.icon && (
                    <span className={cn(item.icon, "mr-2 fa-fw")} />
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
