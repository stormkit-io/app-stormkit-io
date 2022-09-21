import React from "react";
import cn from "classnames";
import MuiModal, { ModalProps } from "@mui/material/Modal";

interface Props extends ModalProps {
  maxWidth?: "max-w-128" | "max-w-screen-md";
  fullHeight?: boolean;
}

const Modal: React.FC<Props> = ({
  maxWidth = "max-w-128",
  fullHeight,
  className,
  children,
  ...rest
}) => {
  return (
    <MuiModal {...rest}>
      <div
        className={cn(
          "bg-blue-50 text-gray-80 w-full lg:ml-8 fixed left-1/2 overflow-auto",
          maxWidth,
          className,
          {
            "top-1/2 max-h-full": !fullHeight,
            "top-4 bottom-4": fullHeight,
          }
        )}
        style={{
          transform: fullHeight ? "translate(-50%)" : "translate(-50%, -50%)",
        }}
      >
        {children}
      </div>
    </MuiModal>
  );
};

export default Modal;
