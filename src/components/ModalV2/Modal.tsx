import type { SxProps } from "@mui/material";
import React from "react";
import Box from "@mui/material/Box";
import MuiModal, { ModalProps } from "@mui/material/Modal";

interface Props extends ModalProps {
  sx?: SxProps;
  maxWidth?: "sm" | "md" | "lg";
}

const Modal: React.FC<Props> = ({
  children,
  open,
  maxWidth = "md",
  ...rest
}) => {
  return (
    <MuiModal
      open={open}
      {...rest}
      sx={{
        display: "flex",
        width: "100vw",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        ...rest.sx,
      }}
    >
      <Box
        maxWidth={maxWidth}
        width="100%"
        bgcolor="background.default"
        sx={{ color: "white" }}
      >
        {children}
      </Box>
    </MuiModal>
  );
};

export default Modal;
