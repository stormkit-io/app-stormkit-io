import React from "react";
import cn from "classnames";
import { CSSTransition } from "react-transition-group";
import { createPortal } from "react-dom";
import "./SideBar.css";

interface Props {
  isOpen: boolean;
  maxWidth?: "max-w-128" | "max-w-72";
  children: React.ReactNode;
}

const SideBar: React.FC<Props> = ({
  isOpen,
  children,
  maxWidth = "max-w-72",
}) => {
  return createPortal(
    <CSSTransition in={isOpen} timeout={200} classNames="side-bar">
      <div
        className={cn(
          "fixed bottom-0 top-0 w-full bg-blue-50 right-0 side-bar text-gray-80 p-4 overflow-auto",
          `lg:${maxWidth}`
        )}
      >
        {children}
      </div>
    </CSSTransition>,
    document.querySelector("#side-bar-root")!
  );
};

export default SideBar;
