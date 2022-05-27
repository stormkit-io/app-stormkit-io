import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import { RootContextProps } from "~/pages/Root.context";
import { AppContextProps } from "~/pages/apps/App.context";
import Modal from "~/components/Modal";
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
            <Form.Option value={"aws_s3"}>AWS S3</Form.Option>
          </Form.Select>
          <Form.Helper>
            Your build artifacts will be uploaded to this provider.
          </Form.Helper>
        </div>
        {integration !== undefined && (
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
        )}
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
              <Form.Helper>The API key of your storage zone</Form.Helper>
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
              <Form.Helper>
                The name of the Storage zone - it corresponds to the{" "}
                <b>username</b> under FTP &amp; API Access
              </Form.Helper>
            </div>
          </>
        )}

        {integration === "aws_s3" && (
          <>
            <div className="mb-8">
              <Form.Input
                name="settings.ACCESS_KEY_ID"
                label="Access Key ID"
                className="bg-gray-90"
                required
                defaultValue={
                  environment.customStorage?.settings?.["ACCESS_KEY_ID"]
                }
                fullWidth
                inputProps={{
                  "aria-label": "Access key ID",
                }}
              />
              <Form.Helper>
                AWS Access Key ID obtained from IAM service
              </Form.Helper>
            </div>
            <div className="mb-8">
              <Form.Input
                name="settings.SECRET_ACCESS_KEY"
                label="Secret Access Key"
                className="bg-gray-90"
                required
                defaultValue={
                  environment.customStorage?.settings?.["SECRET_ACCESS_KEY"]
                }
                fullWidth
                inputProps={{
                  "aria-label": "Secret Access Key",
                }}
              />
              <Form.Helper>
                AWS Secret Access Key obtained from IAM service
              </Form.Helper>
            </div>
            <div className="mb-8">
              <Form.Input
                name="settings.BUCKET_NAME"
                label="Bucket Name"
                className="bg-gray-90"
                required
                defaultValue={
                  environment.customStorage?.settings?.["BUCKET_NAME"]
                }
                fullWidth
                inputProps={{
                  "aria-label": "Bucket name",
                }}
              />
              <Form.Helper>S3 Bucket Name</Form.Helper>
            </div>
            <div className="mb-8">
              <Form.Input
                name="settings.KEY_PREFIX"
                label="Key prefix"
                className="bg-gray-90"
                defaultValue={
                  environment.customStorage?.settings?.["KEY_PREFIX"]
                }
                fullWidth
                inputProps={{
                  "aria-label": "Key prefix",
                }}
              />
              <Form.Helper>
                Key prefis is the path to upload the files inside your Bucket.
                Do not prefix with a forward slash (/).
              </Form.Helper>
            </div>
            <div className="mb-8">
              <Form.Input
                name="settings.REGION"
                label="AWS Region"
                className="bg-gray-90"
                defaultValue={environment.customStorage?.settings?.["REGION"]}
                fullWidth
                inputProps={{
                  "aria-label": "Region name",
                }}
              />
              <Form.Helper>
                Region name where there bucket was created. Defaults to{" "}
                <b>eu-central-1</b>.
              </Form.Helper>
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
            disabled={!integration}
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
    Custom storage allows you deploy your application on a different supported
    platform. Simply provide your access key and Stormkit will integrate
    seamlessly.
  </p>
);

export default CustomStorageFormModal;
