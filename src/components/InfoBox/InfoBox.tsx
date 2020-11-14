import React, { FC, ReactElement, useEffect, useRef, useState, ReactNode } from "react";
import cn from "classnames";
import Button from "~/components/Button";
import "./InfoBox.css";

export const ACTION_REQUIRED = "action-required";
export const SUCCESS = "success";
export const WARNING = "warning";
export const ERROR = "error";
export const DEFAULT = "default";

const icons = {
  [ACTION_REQUIRED]: "fas fa-briefcase",
  [SUCCESS]: "fas fa-check",
  [WARNING]: "fas fa-radiation",
  [ERROR]: "fas fa-exclamation-triangle",
  [DEFAULT]: "fas fa-info"
};

const colors = {
  [ACTION_REQUIRED]: {
    text: "blue-20",
    bg: "blue-90",
    border: "",
    icon: ""
  },
  [DEFAULT]: {
    text: "blue-30",
    bg: "blue-90",
    border: "transparent",
    icon: "blue-80"
  },
  [SUCCESS]: {
    text: "white",
    bg: "green-50",
    border: "green-50",
    icon: ""
  },
  [WARNING]: {
    text: "",
    bg: "yellow-80",
    border: "yellow-60",
    icon: "yellow-30"
  },
  [ERROR]: {
    text: "white",
    bg: "red-50",
    border: "red-50",
    icon: ""
  },
};

type StateClass =
  typeof ACTION_REQUIRED |
  typeof SUCCESS |
  typeof WARNING |
  typeof ERROR |
  typeof DEFAULT;

type Props = {
  children: ReactNode,
  className?: string,
  type: StateClass,
  showIcon?: boolean,
  scrollIntoView?: boolean,
  toaster?: boolean,
  dismissable?: boolean,
  onDismissed?: () => void,
}

const InfoBox: FC<Props> = ({
  children,
  className,
  scrollIntoView,
  showIcon,
  type,
  toaster,
  dismissable,
  onDismissed
}: Props): ReactElement => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current?.scrollIntoView && scrollIntoView) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [ref, scrollIntoView]);

  const classes: Array<string> = [
    "rounded",
    "px-4",
    "py-2",
    "flex",
    "items-center",
    "text-sm",
    `bg-${colors[type].bg}`,
    `text-${colors[type].text}`,
    "border",
    "border-solid",
    `border-${colors[type].border}`
  ];

  if (isOpen === false) {
    return <></>;
  }

  return (
    <div
      ref={ref}
      className={cn(classes, className, {
        shadow: toaster,
        "infobox-toaster": toaster,
        "w-full": !toaster
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
      <div className="flex-auto">{children}</div>
      {dismissable && (
        <Button
          className="ml-4"
          styled={false}
          onClick={() => {
            setIsOpen(false);
            onDismissed && onDismissed();
          }}
        >
          <span className="fas fa-times font-bold text-xl" />
        </Button>
      )}
    </div>
  );
};

InfoBox.defaultProps = {
  type: DEFAULT,
  showIcon: true,
} as Partial<Props>;

export default InfoBox;
