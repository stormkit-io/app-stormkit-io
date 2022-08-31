import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ConfirmModal from "~/components/ConfirmModal";
import InfoBox from "~/components/InfoBox";
import Form from "~/components/Form";
import Button from "~/components/Button";
import { deleteApp } from "../actions";

interface Props {
  app: App;
}

const FormDangerZone: React.FC<Props> = ({ app }): React.ReactElement => {
  const [isConfirmModalOpen, toggleConfirmModal] = useState(false);
  const history = useHistory();

  return (
    <Form.Section label="Danger Zone" marginBottom="mb-4">
      <InfoBox className="mb-4">
        <p>
          Deleting an application will remove all associated files and
          endpoints. After confirming the deletion, we won't be able to do much
          to recover it. <b>Please proceed cautiously</b>.
        </p>
      </InfoBox>
      <div className="flex justify-end">
        <Button
          primary
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
            deleteApp({ app, history, setLoading, setError });
          }}
        >
          This will completely remove the application. All associated files and
          endpoints will be gone. Remember there is no going back from here.
        </ConfirmModal>
      )}
    </Form.Section>
  );
};

export default FormDangerZone;
