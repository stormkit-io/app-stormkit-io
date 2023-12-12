import React, { useState } from "react";
import { json } from "@codemirror/lang-json";
import Modal from "~/components/Modal";
import Form from "~/components/FormV2";
import InfoBox from "~/components/InfoBoxV2";
import Button from "~/components/ButtonV2";
import Link from "~/components/Link";
import Container from "~/components/Container";
import { upsertFunctionTrigger } from "../actions";

interface Props {
  triggerFunction?: FunctionTrigger;
  app: App;
  environment: Environment;
  closeModal: () => void;
  onSuccess: () => void;
}

interface FormValues {
  url: string;
  cron: string;
  method: FunctionTriggerMethod;
  status: "true" | "false";
  "headers[key]": string | string[];
  "headers[value]": string | string[];
}

const convertKeyValueToString = (
  keys: string[] | string,
  values: string[] | string
): string => {
  if (typeof keys === "string") {
    return keys === "" || values === "" ? "" : `${keys}:${values}`;
  }

  return keys.map((key, index) => `${key}:${values[index]}`).join(";");
};

const convertStringToHeaders = (headers: string): { [k: string]: string } => {
  const obj: Record<string, string> = {};

  headers.split(";").map(header => {
    const [key, value] = header.split(":");
    obj[key] = value;
  });

  return obj;
};

const TriggerFunctionModal: React.FC<Props> = ({
  closeModal,
  onSuccess,
  triggerFunction,
  app,
  environment,
}) => {
  const options = triggerFunction?.options;
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(Boolean(triggerFunction?.status));
  const [showHeaders, setShowHeaders] = useState(Boolean(options?.headers));
  const [showPayload, setShowPayload] = useState(Boolean(options?.payload));
  const [codeContent, setCodeContent] = useState(options?.payload || "");
  const urlPrefix = `https://${environment?.getDomainName?.()}/api/`;

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    setError(null);

    const { url: rawUrl = "", cron, method } = values;
    const url = `${urlPrefix}${rawUrl}`;

    let headers = "";

    if (showHeaders === true) {
      headers = convertKeyValueToString(
        values["headers[key]"],
        values["headers[value]"]
      );
    }

    upsertFunctionTrigger({
      tfid: triggerFunction?.id,
      appId: app.id,
      envId: environment.id || "",
      cron,
      status,
      options: {
        url,
        method,
        headers,
        payload: codeContent,
      },
    })
      .then(() => {
        closeModal();
        onSuccess();
      })
      .catch((e: string | Error) => {
        if (typeof e === "string") {
          setError(e);
        } else {
          setError("Something went wrong while saving function trigger.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal open onClose={closeModal}>
      <Container
        maxWidth="max-w-2xl"
        title={
          triggerFunction?.id
            ? "Edit trigger function"
            : "Create trigger function"
        }
      >
        <Form<FormValues> handleSubmit={handleSubmit} className="mb-4">
          <Form.WithLabel
            label="Url"
            className="py-0 mb-4"
            tooltip={
              <div>
                <Link
                  to="https://www.stormkit.io/docs/features/writing-api"
                  secondary
                >
                  Check the documentation
                </Link>{" "}
                to see how to write an API.
              </div>
            }
          >
            <Form.Input
              name="url"
              autoFocus
              fullWidth
              defaultValue={options?.url?.split("/api/")[1] || ""}
              inputProps={{ className: "p-3 pl-0 text-gray-80" }}
              InputProps={{
                startAdornment: (
                  <div className="text-gray-40 select-none whitespace-pre">
                    {urlPrefix}
                  </div>
                ),
              }}
            />
          </Form.WithLabel>

          <Form.WithLabel
            label="Cron"
            className="py-0"
            tooltip={
              <div>
                Check{" "}
                <Link to="https://crontab.guru/" secondary>
                  crontab.guru
                </Link>{" "}
                for expressions
              </div>
            }
          >
            <Form.Input
              name="cron"
              required
              fullWidth
              placeholder="* * * * *"
              defaultValue={triggerFunction?.cron || ""}
            />
          </Form.WithLabel>

          <Form.WithLabel label="Http method" className="pb-0 mb-4">
            <Form.Select
              name="method"
              defaultValue={triggerFunction?.options.method || "GET"}
              className="no-border h-full"
            >
              <Form.Option value="POST"> POST </Form.Option>
              <Form.Option value="GET"> GET </Form.Option>
              <Form.Option value="PUT"> PUT </Form.Option>
              <Form.Option value="DELETE"> DELETE </Form.Option>
            </Form.Select>
          </Form.WithLabel>

          <Form.WithLabel label="Enable headers" className="pt-0">
            <Form.Switch
              color="secondary"
              checked={showHeaders}
              onChange={e => setShowHeaders(e.target.checked)}
            />
          </Form.WithLabel>

          {showHeaders && (
            <div className="mx-4" data-testid="request-headers">
              <Form.KeyValue
                inputName="headers"
                keyName="Header name"
                keyPlaceholder="Content-Type"
                valName="Header value"
                valPlaceholder="application/json"
                defaultValue={
                  triggerFunction?.options.headers
                    ? convertStringToHeaders(triggerFunction?.options.headers)
                    : {}
                }
              />
            </div>
          )}

          <Form.WithLabel label="Enable payload" className="pt-0">
            <Form.Switch
              color="secondary"
              checked={showPayload}
              onChange={e => setShowPayload(e.target.checked)}
            />
          </Form.WithLabel>

          {showPayload && (
            <div className="mx-4" data-testid="cron-payload">
              <Form.Code
                height="200px"
                className="mb-4"
                value={codeContent}
                extensions={[json()]}
                theme="dark"
                onChange={value => setCodeContent(value)}
              />
            </div>
          )}

          <Form.WithLabel label="Enable trigger" className="pb-0 pt-0 mt-0">
            <div className="bg-blue-10 w-full flex justify-between pr-4 items-center">
              <Form.Switch
                color="secondary"
                checked={status}
                name="status"
                onChange={e => setStatus(e.target.checked)}
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
              {triggerFunction?.id ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Container>
    </Modal>
  );
};

export default TriggerFunctionModal;
