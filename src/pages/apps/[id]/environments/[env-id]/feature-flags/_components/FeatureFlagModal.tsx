import type { FormValues } from "../actions";
import React, { useState } from "react";
import Button from "@mui/lab/LoadingButton";
import Modal from "~/components/Modal";
import Form from "~/components/FormV2";
import InfoBox from "~/components/InfoBox";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
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
      >
        <Card>
          <CardHeader
            title={flag?.flagName ? "Edit feature flag" : "Create feature flag"}
          />
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
                color="secondary"
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
          <CardFooter>
            <Button type="button" variant="text" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              sx={{ ml: 2 }}
              loading={loading}
            >
              {flag ? "Update" : "Create"}
            </Button>
          </CardFooter>
        </Card>
      </Form>
    </Modal>
  );
};

export default FeatureFlagModal;
