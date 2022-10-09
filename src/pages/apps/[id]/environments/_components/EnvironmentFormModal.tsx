import React from "react";
import Modal from "~/components/ModalV2";
import EnvironmentForm from "../[env-id]/config/_components/EnvironmentForm";
import { insertEnvironment } from "../[env-id]/config/actions";

interface Props {
  onClose: () => void;
  isOpen: boolean;
  app: App;
}

const EnvironmentFormModal: React.FC<Props> = ({ isOpen, app, onClose }) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      className="p-4 bg-blue-10"
      maxWidth="max-w-screen-md"
      fullHeight
    >
      <EnvironmentForm
        app={app}
        title="Create new environment"
        onCancel={onClose}
        formHandler={({ values, setLoading, setError, setSuccess }) => {
          setError(undefined);
          setLoading(true);
          insertEnvironment({ app, values })
            .then(({ envId }) => {
              // We need to refresh a bunch of stuff, so it's easier to make a hard refresh.
              window.location.assign(
                `/apps/${app.id}/environments/${envId}/deployments`
              );
            })
            .catch(async res => {
              try {
                if (typeof res === "string") {
                  setError(res);
                } else {
                  const data = await res.json();

                  if (data.error) {
                    setError(data.error);
                  } else {
                    setError(Object.values(data.errors).join(""));
                  }
                }
              } catch {
                setError(
                  "Something went wrong while inserting the environment."
                );
              }
            })
            .finally(() => {
              setLoading(false);
            });
        }}
      />
    </Modal>
  );
};

export default EnvironmentFormModal;
