import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import { RootContextProps } from "~/pages/Root.context";
import { AppContextProps } from "~/pages/apps/App.context";
import Modal from "~/components/Modal";
import Link from "~/components/Link";
import Form from "~/components/Form";
import Button from "~/components/Button";
import InfoBox from "~/components/InfoBox";
import { updateIntegration } from "../actions";

interface Props
  extends Pick<RootContextProps, "api">,
    Pick<AppContextProps, "app"> {
  environment: Environment;
  user: User;
  toggleModal: (val: boolean) => void;
}

const CustomStorageFormModal: React.FC<Props> = ({
  toggleModal,
  environment,
  api,
  app,
  user,
}): React.ReactElement => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [integration, setIntegration] = useState<Integration | undefined>(
    environment.customStorage?.integration
  );

  return (
    <Modal
      isOpen
      onClose={() => toggleModal(false)}
      className="max-w-screen-sm"
    >
      <Form
        handleSubmit={updateIntegration({
          api,
          app,
          environmentId: environment.id || "",
          history,
          toggleModal,
          setLoading,
          setError,
        })}
      >
        <Form.Header className="mb-4">
          Custom storage
          <Tooltip title={<Explanation />} placement="top" arrow>
            <span className="fas fa-question-circle ml-2" />
          </Tooltip>
        </Form.Header>
        {!user.package.customStorage && (
          <InfoBox className="mb-4">
            <div data-testid="paid-tier">
              This is a paid feature. Please{" "}
              <Link secondary to="/user/account" className="text-white">
                upgrade
              </Link>{" "}
              to at least starter package in order to use it.
            </div>
          </InfoBox>
        )}
        <div className="mb-8">
          <Form.Select
            name="integration"
            displayEmpty
            value={integration || ""}
            onChange={e => {
              setIntegration(e.target.value as Integration);
            }}
          >
            <Form.Option disabled value={""}>
              Integration
            </Form.Option>
            <Form.Option value={"bunny_cdn"}>Bunny CDN</Form.Option>
          </Form.Select>
          <Form.Helper>
            Your build artifacts will be uploaded to this provider.
          </Form.Helper>
        </div>
        <div className="mb-8">
          <Form.Input
            name="externalUrl"
            label="External URL"
            className="bg-gray-90"
            required
            defaultValue={environment.customStorage?.externalUrl}
            fullWidth
            tooltip="Your website's URL. This value will also be visible on your Pull request preview links."
            inputProps={{
              "aria-label": "External URL",
            }}
          />
          <Form.Helper>
            Fully qualified URL. e.g. https://www.stormkit.io
          </Form.Helper>
        </div>
        {integration === "bunny_cdn" && (
          <>
            <div className="mb-8">
              <Form.Input
                name="settings.STORAGE_KEY"
                label="Storage key"
                className="bg-gray-90"
                required
                defaultValue={
                  environment.customStorage?.settings?.["STORAGE_KEY"]
                }
                fullWidth
                inputProps={{
                  "aria-label": "Storage key",
                }}
              />
              <Form.Helper>The API key of your storage zone.</Form.Helper>
            </div>
            <div className="mb-8">
              <Form.Input
                name="settings.STORAGE_ZONE"
                label="Storage zone"
                className="bg-gray-90"
                required
                defaultValue={
                  environment.customStorage?.settings?.["STORAGE_ZONE"]
                }
                fullWidth
                inputProps={{
                  "aria-label": "Storage zone",
                }}
              />
              <Form.Helper>The name of the storage zone.</Form.Helper>
            </div>
          </>
        )}
        {error && (
          <InfoBox type={InfoBox.ERROR} className="mb-8">
            {error}
          </InfoBox>
        )}
        <div className="flex flex-auto justify-end">
          <Button type="button" secondary onClick={() => toggleModal(false)}>
            Cancel
          </Button>
          <Button
            primary
            className="ml-4"
            disabled={!integration || !user.package.customStorage}
            loading={loading}
          >
            Submit
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

const Explanation = () => (
  <p>
    Custom storage allows you to benefit Stormkit's powerful developer
    experience while hosting your application on a different supported platform.
    Simply provide your access key and Stormkit will integrate seamlessly.
  </p>
);

export default CustomStorageFormModal;
