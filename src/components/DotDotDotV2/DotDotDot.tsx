import React, { useState } from "react";
import { useNavigate } from "react-router";
import cn from "classnames";
import { Tooltip } from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Button from "~/components/Button";

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
  const navigate = useNavigate();

  if (!isOpen) {
    return (
      <Button styled={false} onClick={() => toggleIsOpen(!isOpen)}>
        <span className="fas fa-ellipsis-h cursor-pointer" />
      </Button>
    );
  }

  return (
    <Tooltip
      placement="bottom"
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
              <button
                key={index}
                type="button"
                disabled={item.disabled}
                onClick={() => {
                  if (typeof item.onClick === "function") {
                    item.onClick();
                  } else if (item.href) {
                    navigate(item.href);
                  }

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
                {item.icon && <span className={cn(item.icon, "mr-2 fa-fw")} />}
                {item.text}
              </button>
            ))}
          </div>
        </ClickAwayListener>
      }
    >
      <Button styled={false} onClick={() => toggleIsOpen(!isOpen)}>
        <span className="fas fa-ellipsis-h cursor-pointer" />
      </Button>
    </Tooltip>
  );
};

export default DotDotDot;
