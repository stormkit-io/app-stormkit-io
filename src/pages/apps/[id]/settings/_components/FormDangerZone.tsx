import React, { useState } from "react";
import ConfirmModal from "~/components/ConfirmModal";
import InfoBox from "~/components/InfoBoxV2";
import Button from "~/components/ButtonV2";
import { deleteApp } from "../actions";

interface Props {
  app: App;
}

const FormDangerZone: React.FC<Props> = ({ app }): React.ReactElement => {
  const [isConfirmModalOpen, toggleConfirmModal] = useState(false);

  return (
    <>
      <InfoBox className="mb-4 mx-4">
        <p>
          Deleting an application will remove all associated files and
          endpoints. After confirming the deletion, we won't be able to do much
          to recover it. <b>Please proceed cautiously</b>.
        </p>
      </InfoBox>
      <div className="flex justify-end mx-4 pb-4">
        <Button
          category="action"
          type="submit"
          onClick={() => {
            toggleConfirmModal(true);
          }}
        >
          Remove application
        </Button>
      </div>
      {isConfirmModalOpen && (
        <ConfirmModal
          typeConfirmationText="permanently delete application"
          onCancel={() => {
            toggleConfirmModal(false);
          }}
          onConfirm={({ setLoading, setError }) => {
            setLoading(true);
            deleteApp({ app })
              .then(() => {
                setLoading(false);
                window.location.assign("/");
              })
              .catch(() => {
                setLoading(false);
                setError(
                  "Something went wrong while deleting application. Please retry later."
                );
              });
          }}
        >
          This will completely remove the application. All associated files and
          endpoints will be gone. Remember there is no going back from here.
        </ConfirmModal>
      )}
    </>
  );
};

export default FormDangerZone;
