import React, { useState } from "react";
import Modal from "~/components/Modal";
import Form from "~/components/Form";
import InfoBox from "~/components/InfoBox";
import Button from "~/components/Button";
import Api from "~/utils/api/Api";
import { upsertFeatureFlag } from "../actions";

interface Props {
  flag?: FeatureFlag;
  api: Api;
  app: App;
  environment: Environment;
  closeModal: () => void;
  setReload: (val: number) => void;
}

const FeatureFlagModal: React.FC<Props> = ({
  closeModal,
  setReload,
  flag,
  api,
  app,
  environment,
}) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <Modal isOpen onClose={closeModal} className="max-w-screen-lg">
      <h2 className="mb-8 text-xl font-bold">
        {flag?.flagName ? "Edit feature flag" : "Create feature flag"}
      </h2>
      <Form
        handleSubmit={upsertFeatureFlag({
          api,
          app,
          environment,
          setError,
          setLoading,
          closeModal,
          setReload,
        })}
        className="mb-8"
      >
        <div className="mb-4">
          <Form.Input
            name="name"
            label="Name"
            required
            fullWidth
            defaultValue={flag?.flagName}
          />
        </div>
        <div className="mb-4">
          <Form.Select defaultValue={false} name="status">
            <Form.Option value={"true"}>True</Form.Option>
            <Form.Option value={"false"}>False</Form.Option>
          </Form.Select>
        </div>
        <div className="flex flex-wrap justify-between mb-4"></div>
        {error && (
          <InfoBox className="mt-8" type={InfoBox.ERROR}>
            {error}
          </InfoBox>
        )}
        <div className="flex justify-center items-center mt-8">
          <Button secondary onClick={closeModal}>
            Cancel
          </Button>
          <Button primary className="ml-4" loading={loading}>
            {flag ? "Update" : "Create"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default FeatureFlagModal;
