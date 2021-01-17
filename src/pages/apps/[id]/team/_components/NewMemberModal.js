import React, { useState } from "react";
import PropTypes from "prop-types";
import ReferralForm from "~/pages/user/referrals/_components/ReferralForm";
import Modal from "~/components/Modal";
import CopyBox from "~/components/CopyBox";
import InfoBox from "~/components/InfoBox";
import Button from "~/components/Button";
import { connect } from "~/utils/context";
import { handleInvite } from "../actions";

const ModalContext = Modal.Context();

const getLinkFromToken = token =>
  `${window.location.origin}/app/invitation/accept?token=${encodeURIComponent(
    token
  )}`;

const NewMemberModal = ({ isOpen, toggleModal, api, app }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const link = getLinkFromToken(token);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setError(null);
        toggleModal(false);
      }}
      className="max-w-screen-md"
    >
      <h2 className="mb-8 text-xl font-bold">Invite new member</h2>
      {!token ? (
        <>
          <InfoBox className="mb-8">
            Enter the username to invite your colleague to the team. In the next
            step you'll get a link to share.
          </InfoBox>
          <ReferralForm
            api={api}
            error={error}
            loading={loading}
            onSubmit={handleInvite({
              app,
              api,
              setLoading,
              setToken,
              setError
            })}
          />
        </>
      ) : (
        <>
          <InfoBox className="mb-4">
            Share the following link with the member to be invited. The
            invitation is valid for 24 hours.
          </InfoBox>
          <div className="flex mb-4 p-4 rounded bg-gray-85">
            <CopyBox value={link} />
          </div>
          <div className="flex justify-end">
            <Button secondary onClick={() => setToken(null)}>
              Restart process
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};

NewMemberModal.propTypes = {
  isOpen: PropTypes.bool,
  toggleModal: PropTypes.func,
  api: PropTypes.object,
  app: PropTypes.object
};

export default Object.assign(
  connect(NewMemberModal, [
    { Context: ModalContext, props: ["toggleModal", "isOpen"] }
  ]),
  ModalContext
);
