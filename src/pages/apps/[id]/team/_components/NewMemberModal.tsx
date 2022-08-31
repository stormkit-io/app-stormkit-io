import React, { useState } from "react";
import ReferralForm from "~/pages/user/referrals/_components/ReferralForm";
import Modal from "~/components/Modal";
import CopyBox from "~/components/CopyBox";
import InfoBox from "~/components/InfoBox";
import Button from "~/components/Button";
import { handleInvite } from "../actions";

const getLinkFromToken = (token: string) =>
  `${window.location.origin}/app/invitation/accept?token=${encodeURIComponent(
    token
  )}`;

interface Props {
  app: App;
  onClose: () => void;
}

const NewMemberModal: React.FC<Props> = ({ app, onClose }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const link = token ? getLinkFromToken(token) : "";

  return (
    <Modal
      isOpen
      onClose={() => {
        setError(null);
        onClose();
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
            error={error}
            loading={loading}
            onSubmit={handleInvite({
              app,
              setLoading,
              setToken,
              setError,
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

export default NewMemberModal;
