import type { IntegrationFormValues } from "../actions";
import React, { useState } from "react";
import cn from "classnames";
import Container from "~/components/Container";
import InfoBox from "~/components/InfoBoxV2";
import Form from "~/components/FormV2";
import Button from "~/components/ButtonV2";
import { updateIntegration, deleteIntegration } from "../actions";

interface Props {
  app: App;
  environment: Environment;
  setRefreshToken: (val: number) => void;
}

const CustomStorage: React.FC<Props> = ({
  app,
  environment,
  setRefreshToken,
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState<React.ReactNode>();
  const [integration, setIntegration] = useState<Integration | undefined>(
    environment.customStorage?.integration
  );

  return (
    <Form<IntegrationFormValues>
      id="custom-storage-form"
      handleSubmit={values => {
        setLoading(true);
        setSuccess(false);
        setError(undefined);
        updateIntegration({
          app,
          values,
          environmentId: environment.id!,
        })
          .then(() => {
            setSuccess(true);
            setRefreshToken(Date.now());
          })
          .catch(async e => {
            if (typeof e === "string") {
              return setError(e);
            }

            try {
              const data = await e.json();
              setError(
                Object.values(data.errors).map(e => (
                  <div>{e as React.ReactNode}</div>
                ))
              );
            } catch {
              setError("Something went wrong while setting custom storage.");
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }}
    >
      <Container title="Configure custom storage" maxWidth="max-w-none">
        <Form.WithLabel
          label="Provider"
          className="pt-0"
          tooltip={"Build artifacts will be uploaded to this provider."}
        >
          <Form.Select
            name="integration"
            background="transparent"
            textColor="gray-80"
            className="no-border h-full"
            displayEmpty
            value={integration || ""}
            onChange={e => {
              setIntegration(e.target.value as Integration);
            }}
          >
            <Form.Option disabled value={""}>
              Choose an integration
            </Form.Option>
            <Form.Option value="bunny_cdn">Bunny CDN</Form.Option>
            <Form.Option value="aws_s3">AWS S3</Form.Option>
          </Form.Select>
        </Form.WithLabel>
        {integration !== undefined && (
          <Form.WithLabel
            label="External URL"
            tooltip="This is your custom domain that is not managed by Stormkit. It will be used to provide preview links."
          >
            <Form.Input
              name="externalUrl"
              defaultValue={environment.customStorage?.externalUrl}
              placeholder="e.g. https://www.stormkit.io"
              fullWidth
              required
              className="bg-blue-10 no-border h-full"
            />
          </Form.WithLabel>
        )}
        {integration === "bunny_cdn" && (
          <>
            <Form.WithLabel label="Storage key">
              <Form.Password
                name="settings.STORAGE_KEY"
                className="bg-blue-10 no-border h-full"
                placeholder="The API key of your storage zone"
                required
                defaultValue={
                  environment.customStorage?.settings?.["STORAGE_KEY"]
                }
                fullWidth
              />
            </Form.WithLabel>
            <Form.WithLabel
              label="Storage zone"
              tooltip={
                <span>
                  The name of the Storage zone - it corresponds to the{" "}
                  <b>username</b> under FTP &amp; API Access
                </span>
              }
            >
              <Form.Input
                name="settings.STORAGE_ZONE"
                className="bg-blue-10 no-border h-full"
                placeholder="My storage zone"
                required
                defaultValue={
                  environment.customStorage?.settings?.["STORAGE_ZONE"]
                }
                fullWidth
              />
            </Form.WithLabel>
          </>
        )}

        {integration === "aws_s3" && (
          <>
            <Form.WithLabel
              label="Access Key ID"
              tooltip="AWS Access Key ID obtained from IAM service"
            >
              <Form.Input
                name="settings.ACCESS_KEY_ID"
                className="bg-blue-10 no-border h-full"
                required
                defaultValue={
                  environment.customStorage?.settings?.["ACCESS_KEY_ID"]
                }
                fullWidth
              />
            </Form.WithLabel>
            <Form.WithLabel
              label="Secret Access Key"
              tooltip="AWS Secret Access Key obtained from IAM service"
            >
              <Form.Password
                name="settings.SECRET_ACCESS_KEY"
                className="bg-blue-10 no-border h-full"
                required
                defaultValue={
                  environment.customStorage?.settings?.["SECRET_ACCESS_KEY"]
                }
                fullWidth
              />
            </Form.WithLabel>
            <Form.WithLabel label="Bucket name" tooltip="S3 Bucket Name">
              <Form.Input
                name="settings.BUCKET_NAME"
                className="bg-blue-10 no-border h-full"
                required
                defaultValue={
                  environment.customStorage?.settings?.["BUCKET_NAME"]
                }
                fullWidth
              />
            </Form.WithLabel>
            <Form.WithLabel
              label="Key prefix"
              tooltip="
                Key prefis is the path to upload the files inside your Bucket.
                Do not prefix with a forward slash (/)."
            >
              <Form.Input
                name="settings.KEY_PREFIX"
                className="bg-blue-10 no-border h-full"
                defaultValue={
                  environment.customStorage?.settings?.["KEY_PREFIX"]
                }
                fullWidth
              />
            </Form.WithLabel>
            <Form.WithLabel
              label="AWS Region"
              tooltip={
                <span>
                  Region name where there bucket was created. Defaults to{" "}
                  <b>eu-central-1</b>.
                </span>
              }
            >
              <Form.Input
                name="settings.REGION"
                placeholder="e.g eu-central-1"
                className="bg-blue-10 no-border h-full"
                defaultValue={environment.customStorage?.settings?.["REGION"]}
                fullWidth
              />
            </Form.WithLabel>
          </>
        )}
      </Container>
      {error && (
        <InfoBox type={InfoBox.ERROR} className="mt-4">
          {error}
        </InfoBox>
      )}
      {success && (
        <InfoBox type={InfoBox.SUCCESS} className="mt-4">
          Custom storage configuration saved successfully. Your app will now be
          served from your custom storage.
        </InfoBox>
      )}
      <div
        className={cn("flex flex-auto pt-4 text-gray-80", {
          "justify-between": integration,
          "justify-end": !integration,
        })}
      >
        {integration && (
          <div>
            <Button
              type="button"
              category="cancel"
              className="bg-blue-20"
              loading={deleteLoading}
              onClick={() => {
                setDeleteLoading(true);
                setSuccess(false);
                setError(undefined);
                deleteIntegration({
                  app,
                  environmentId: environment.id!,
                })
                  .then(() => {
                    setIntegration(undefined);
                    setRefreshToken(Date.now());
                  })
                  .finally(() => {
                    setDeleteLoading(false);
                  });
              }}
            >
              Remove
            </Button>
          </div>
        )}
        <div>
          <Button
            type="button"
            category="cancel"
            className="bg-blue-20"
            onClick={() => {
              const form = document.querySelector(
                "#custom-storage-form"
              ) as HTMLFormElement;

              form.reset();
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            category="action"
            className="ml-4"
            disabled={!integration}
            loading={loading}
          >
            Submit
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default CustomStorage;
