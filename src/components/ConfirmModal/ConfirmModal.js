import React from "react";
import PropTypes from "prop-types";
import Modal from "@components/Modal";
import RootContext from "@console/RootContext";
import { connect } from "~/utils/context";
import { Button } from "~/assets/styles";

const ModalContext = Modal.Context();

const ConfirmModal = connect(
  ({
    isOpen,
    toggleModal,
    title,
    content,
    children,
    confirm = "Confirm",
    onConfirm,
    onClose,
  }) => {
    return (
      <Modal
        isOpen={isOpen}
        onClose={() => {
          toggleModal(false);
          typeof onClose === "function" && onClose();
        }}
        margin="25%"
      >
        <Modal.Title>{title}</Modal.Title>
        <Modal.Content>{content || children}</Modal.Content>
        <Modal.Footer textAlign="center">
          <Button
            primary
            onClick={(e) => {
              e.preventDefault();
              toggleModal(false);
              onConfirm();
            }}
          >
            {confirm}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  },
  [
    { Context: RootContext, props: ["api"] },
    { Context: ModalContext, props: ["toggleModal", "isOpen"] },
  ]
);

ConfirmModal.propTypes = {
  isOpen: PropTypes.bool, // Whether the modal is open or not
  toggleModal: PropTypes.func,
  title: PropTypes.node,
  content: PropTypes.node,
  confirm: PropTypes.node,
  children: PropTypes.node,
  onConfirm: PropTypes.func, // The callback handler for publishing
  onClose: PropTypes.func, // The close toggler.
};

export default Object.assign(ConfirmModal, ModalContext);
