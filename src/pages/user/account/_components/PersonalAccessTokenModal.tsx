import React from "react";
import Modal, { ModalContextProps } from "~/components/Modal";
import { connect } from "~/utils/context";

interface Props {
  hasToken: boolean;
}

const ModalContext = Modal.Context();

const PersonalAccessTokenModal: React.FC<Props & ModalContextProps> = ({
  hasToken,
  isOpen,
  toggleModal,
}): React.ReactElement => {
  return (
    <Modal isOpen={isOpen} onClose={() => toggleModal(false)}>
      {hasToken}
    </Modal>
  );
};

export default Object.assign(
  connect<Props, ModalContextProps>(PersonalAccessTokenModal, [
    { Context: ModalContext, props: ["toggleModal", "isOpen"] },
  ]),
  ModalContext
);
