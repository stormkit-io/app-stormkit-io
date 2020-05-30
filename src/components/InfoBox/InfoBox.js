import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import Button from "~/components/Button";
import "./InfoBox.css";

const ACTION_REQUIRED = "action-required";
const SUCCESS = "success";
const WARNING = "warning";
const ERROR = "error";
const DEFAULT = "default";

const icons = {
  [ACTION_REQUIRED]: "fas fa-briefcase",
  [SUCCESS]: "fas fa-check",
  [WARNING]: "fas fa-radiation",
  [ERROR]: "fas fa-exclamation-triangle",
  [DEFAULT]: "fas fa-info",
};

const colors = {
  [ACTION_REQUIRED]: { text: "blue-20", bg: "blue-90" },
  [DEFAULT]: {
    text: "blue-20",
    bg: "blue-90",
    border: "blue-80",
    icon: "blue-80",
  },
  [SUCCESS]: { text: "white", bg: "green-50", border: "green-50" },
  [WARNING]: {
    text: "text-primary",
    bg: "yellow-80",
    border: "yellow-60",
    icon: "yellow-30",
  },
  [ERROR]: { text: "white", bg: "red-50", border: "red-50" },
};

const InfoBox = ({
  children,
  className,
  scrollIntoView,
  showIcon,
  type,
  toaster,
  dismissable,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && scrollIntoView) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [ref, scrollIntoView]);

  const classes = [
    "rounded",
    "px-4",
    "py-2",
    "flex",
    "items-center",
    `bg-${colors[type].bg}`,
    `text-${colors[type].text}`,
    "border",
    "border-solid",
    `border-${colors[type].border}`,
  ];

  if (isOpen === false) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn(classes, className, {
        shadow: toaster,
        "infobox-toaster": toaster,
        "w-full": !toaster,
      })}
    >
      {showIcon && (
        <span
          className={cn(
            "inline-flex flex-auto flex-grow-0 min-w-10 max-w-10 h-10 items-center justify-center rounded-full mr-4",
            `bg-${colors[type].icon}`
          )}
        >
          <span className={cn(icons[type], "text-2xl")} />
        </span>
      )}
      {children}
      {dismissable && (
        <Button
          className="ml-4"
          styled={false}
          onClick={() => setIsOpen(false)}
        >
          <span className="fas fa-times font-bold text-xl" />
        </Button>
      )}
    </div>
  );
};

InfoBox.ACTION_REQUIRED = ACTION_REQUIRED;
InfoBox.SUCCESS = SUCCESS;
InfoBox.WARNING = WARNING;
InfoBox.ERROR = ERROR;

InfoBox.defaultProps = {
  type: DEFAULT,
  showIcon: true,
};

InfoBox.propTypes = {
  children: PropTypes.node,
  className: PropTypes.any,
  type: PropTypes.oneOf([ACTION_REQUIRED, SUCCESS, WARNING, ERROR, DEFAULT]),
  showIcon: PropTypes.bool,
  scrollIntoView: PropTypes.bool,
  toaster: PropTypes.bool,
  dismissable: PropTypes.bool,
};

export default InfoBox;
