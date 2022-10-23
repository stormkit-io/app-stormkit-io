import React, { useState } from "react";
import ReferralForm from "~/pages/user/referrals/_components/ReferralForm";
import Modal from "~/components/ModalV2";
import CopyBox from "~/components/CopyBox";
import Container from "~/components/Container";
import InfoBox from "~/components/InfoBoxV2";
import Button from "~/components/ButtonV2";
import Link from "~/components/Link";
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
  const [error, setError] = useState<React.ReactNode>(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const link = token ? getLinkFromToken(token) : "";

  return (
    <Modal
      open
      onClose={() => {
        setError(null);
        onClose();
      }}
      className="max-w-screen-md"
    >
      <Container title="Invite new member" maxWidth="max-w-none">
        <div className="mx-4">
          {!token ? (
            <>
              <InfoBox className="mb-4">
                Enter the username to invite your colleague to the team. In the
                next step you'll get a link to share.
              </InfoBox>
              <ReferralForm
                error={error}
                loading={loading}
                onSubmit={values => {
                  setLoading(true);
                  setError(null);

                  handleInvite({
                    app,
                    values,
                  })
                    .then(({ token }) => {
                      setToken(token);
                    })
                    .catch(async res => {
                      if (res.status === 400) {
                        const data = await res.json();

                        if (data.code === "inception") {
                          return setError(
                            "Funny move, but you cannot invite yourself."
                          );
                        }

                        return setError("Please provide a display name.");
                      }

                      if (res.status === 402) {
                        return setError(
                          <div>
                            Your current package does not allow adding more team
                            members. <br />
                            You can always{" "}
                            <Link to="/user/account">upgrade</Link> to proceed.
                          </div>
                        );
                      }
                    })
                    .finally(() => {
                      setLoading(false);
                    });
                }}
              />
            </>
          ) : (
            <>
              <InfoBox className="mb-4">
                Share the following link with the member to be invited. The
                invitation is valid for 24 hours.
              </InfoBox>
              <div className="flex mb-4">
                <CopyBox value={link} />
              </div>
              <div className="flex justify-end mb-4">
                <Button
                  type="button"
                  category="button"
                  onClick={() => setToken(null)}
                >
                  Restart process
                </Button>
              </div>
            </>
          )}
        </div>
      </Container>
    </Modal>
  );
};

export default NewMemberModal;
