import React, { useState } from "react";
import { useNavigate } from "react-router";
import { deploy } from "~/pages/apps/actions";
import { useFetchRepoMeta } from "~/pages/apps/[id]/environments/[env-id]/config/actions";
import { isFrameworkRecognized } from "~/pages/apps/[id]/environments/[env-id]/config/helpers";
import Modal from "~/components/ModalV2";
import EnvironmentSelector from "~/components/EnvironmentSelector";
import InfoBox from "~/components/InfoBoxV2";
import Form from "~/components/FormV2";
import Button from "~/components/ButtonV2";
import Link from "~/components/Link";
import Container from "~/components/Container";
import Spinner from "~/components/Spinner";

interface Props {
  app: App;
  selected?: Environment;
  environments: Array<Environment>;
  toggleModal: (val: boolean) => void;
}

const DeployModal: React.FC<Props> = ({
  toggleModal,
  environments,
  selected: environment,
  app,
}): React.ReactElement => {
  const navigate = useNavigate();
  const [selectedEnv, setSelectedEnv] = useState<Environment | undefined>(
    environment
  );
  const fetchResult = useFetchRepoMeta({ app, env: selectedEnv });
  const [cmd, setCmd] = useState(environment?.build?.cmd || "");
  const [dist, setDist] = useState(environment?.build?.distFolder || "");
  const [branch, setBranch] = useState(environment?.branch || "");
  const [error, setError] = useState<null | string>(null);
  const [isAutoPublish, setIsAutoPublish] = useState<boolean>(
    environment?.autoPublish || false
  );
  const [loading, setLoading] = useState<boolean>(false);
  const { meta, loading: metaLoading } = fetchResult;

  const clearForm = () => {
    setCmd("");
    setDist("");
    setBranch("");
    setSelectedEnv(undefined);
    setIsAutoPublish(false);
  };

  return (
    <Modal
      open
      onClose={() => {
        clearForm();
        toggleModal(false);
      }}
      className="max-w-screen-sm h-full md:h-auto"
    >
      <Container title="Start a deployment">
        <Form
          style={{ minHeight: "20rem" }}
          handleSubmit={() =>
            deploy({
              app,
              environment: selectedEnv,
              setError,
              setLoading,
              config: {
                branch,
                cmd,
                distFolder: dist,
                publish: isAutoPublish || false,
              },
            }).then(deploy => {
              if (deploy) {
                toggleModal(false);
                navigate(
                  `/apps/${app.id}/environments/${selectedEnv?.id}/deployments/${deploy.id}`
                );
              }
            })
          }
        >
          <div className="px-4">
            <EnvironmentSelector
              placeholder="Select an environment to deploy"
              environments={environments}
              defaultValue={environment?.id || ""}
              onSelect={(env: Environment): void => {
                if (env) {
                  setBranch(env.branch);
                  setCmd(env.build.cmd);
                  setDist(env.build.distFolder);
                  setIsAutoPublish(env.autoPublish);
                  setError(null);
                  setSelectedEnv(env);
                } else {
                  clearForm();
                }
              }}
            />
          </div>
          <div>
            <Form.WithLabel label="Checkout branch" className="pb-0">
              <Form.Input
                name="branch"
                className={"no-border bg-blue-10"}
                value={branch}
                onChange={e => {
                  setBranch(e.target.value);
                }}
                inputProps={{
                  "aria-label": "Branch to deploy",
                }}
                fullWidth
              />
            </Form.WithLabel>
            <Form.WithLabel
              label="Build command"
              className="pb-0"
              tooltip="Concatenate multiple commands with the logical `&&` operator (e.g. npm run test && npm run build)"
            >
              <Form.Input
                value={cmd}
                fullWidth
                name="build.cmd"
                onChange={e => setCmd(e.target.value)}
                placeholder="Defaults to 'npm run build' or 'yarn build' or 'pnpm build'"
                className="bg-blue-10 no-border h-full"
              />
            </Form.WithLabel>
            <Form.WithLabel
              label="Output folder"
              className="pb-0"
              tooltip={
                !metaLoading &&
                !isFrameworkRecognized(meta?.framework) &&
                "The folder where the build artifacts are located."
              }
            >
              {!metaLoading && isFrameworkRecognized(meta?.framework) ? (
                <div className="opacity-50 cursor-not-allowed p-2">
                  <span className="fa fa-info-circle mr-2 ml-1" />
                  Output folder read from framework configuration file.
                </div>
              ) : (
                <Form.Input
                  value={dist}
                  fullWidth
                  name="build.distFolder"
                  onChange={e => setDist(e.target.value)}
                  placeholder="Defaults to `build`, `dist`, `output` or `.stormkit`"
                  className="bg-blue-10 no-border h-full"
                  InputProps={{
                    endAdornment: metaLoading && (
                      <Spinner width={4} height={4} />
                    ),
                  }}
                />
              )}
            </Form.WithLabel>
            <Form.WithLabel
              label="Auto publish"
              tooltip="When enabled, successful deployments will be published automatically."
            >
              <div className="bg-blue-10 w-full flex justify-between pr-4 items-center">
                <Form.Switch
                  color="secondary"
                  onChange={e => {
                    setIsAutoPublish(e.target.checked);
                  }}
                  checked={isAutoPublish}
                  name="autoPublish"
                />
              </div>
            </Form.WithLabel>
          </div>
          {error &&
            (error === "repo-not-found" ? (
              <InfoBox type={InfoBox.ERROR} className="mx-4 mb-4">
                Repository is inaccessible. See the{" "}
                <Link
                  className="font-bold hover:text-white hover:underline"
                  to="https://www.stormkit.io/docs/troubleshooting#repository-is-innaccessible"
                >
                  troubleshooting
                </Link>{" "}
                for help.
              </InfoBox>
            ) : (
              <InfoBox type={InfoBox.ERROR} className="mx-4 mb-4">
                {error}
              </InfoBox>
            ))}
          <div className="flex justify-between mb-4 w-full px-4 items-center">
            <Link
              to={`/apps/${app.id}/environments/${selectedEnv?.id}`}
              onClick={() => {
                toggleModal(false);
              }}
              className="underline"
            >
              <span className="fas fa-wrench mr-3" />
              Update default settings
            </Link>
            <Button category="action" type="submit" loading={loading}>
              Deploy now
            </Button>
          </div>
        </Form>
      </Container>
    </Modal>
  );
};

export default DeployModal;
