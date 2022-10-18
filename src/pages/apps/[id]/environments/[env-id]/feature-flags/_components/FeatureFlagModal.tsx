import type { FormValues } from "../actions";
import React, { useState } from "react";
import Modal from "~/components/ModalV2";
import Form from "~/components/FormV2";
import InfoBox from "~/components/InfoBoxV2";
import Button from "~/components/ButtonV2";
import Container from "~/components/Container";
import { upsertFeatureFlag, deleteFeatureFlag } from "../actions";

interface Props {
  flag?: FeatureFlag;
  app: App;
  environment: Environment;
  closeModal: () => void;
  setReload: (val: number) => void;
}

const FeatureFlagModal: React.FC<Props> = ({
  closeModal,
  setReload,
  flag,
  app,
  environment,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <Modal open onClose={closeModal}>
      <Container
        title={flag?.flagName ? "Edit feature flag" : "Create feature flag"}
      >
        <Form<FormValues>
          handleSubmit={async values => {
            setLoading(true);
            setError(null);

            if (flag && flag.flagName !== values.flagName) {
              try {
                await deleteFeatureFlag({
                  app,
                  environment,
                  flagName: flag.flagName,
                });
              } catch {
                // Do nothing, as this step is to clear up the existing one
              }
            }

            upsertFeatureFlag({
              app,
              environment,
              values,
            })
              .then(() => {
                setLoading(false);
                setReload(Date.now());
                closeModal();
              })
              .catch(e => {
                if (typeof e === "string") {
                  setError(e);
                } else {
                  setError("Something went wrong while saving feature flag.");
                }
              })
              .finally(() => {
                setLoading(false);
              });
          }}
          className="mb-4"
        >
          <Form.WithLabel label="Flag name" className="py-0">
            <Form.Input
              name="flagName"
              placeholder="e.g. showBanner"
              required
              fullWidth
              autoFocus
              defaultValue={flag?.flagName || ""}
            />
          </Form.WithLabel>
          <Form.WithLabel label="Enabled" className="pb-0">
            <div className="bg-blue-10 w-full flex justify-between pr-4 items-center">
              <Form.Switch
                color="primary"
                defaultChecked={flag?.flagValue || false}
                name="flagValue"
              />
            </div>
          </Form.WithLabel>
          <div className="flex flex-wrap justify-between mb-4"></div>
          {error && (
            <InfoBox className="mt-4 mx-4" type={InfoBox.ERROR}>
              {error}
            </InfoBox>
          )}
          <div className="flex justify-center items-center mt-4 mb-0">
            <Button
              type="button"
              category="cancel"
              onClick={closeModal}
              className="bg-blue-20"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              category="action"
              className="ml-4"
              loading={loading}
            >
              {flag ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Container>
    </Modal>
  );
};

export default FeatureFlagModal;
