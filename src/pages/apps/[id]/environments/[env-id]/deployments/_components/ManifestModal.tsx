import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import cn from "classnames";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Modal from "~/components/ModalV2";
import Container from "~/components/Container";
import Spinner from "~/components/Spinner";
import InfoBox from "~/components/InfoBoxV2";
import Button from "~/components/ButtonV2";
import Link from "~/components/Link";
import emptyListSvg from "~/assets/images/empty-list.svg";
import { useFetchManifest } from "../actions";

interface Props {
  app: App;
  deployment: Deployment;
  onClose: () => void;
}

type Mode = "json" | "ui";
type Tab = "cdn" | "redirect" | "serverless";

const ManifestModal: React.FC<Props> = ({ app, deployment, onClose }) => {
  const [mode, setMode] = useState<Mode>("ui");
  const [tab, setTab] = useState<Tab>("cdn");

  const { manifest, loading, error } = useFetchManifest({
    appId: app.id,
    deploymentId: deployment.id,
  });

  return (
    <Modal open onClose={onClose} maxWidth="max-w-screen-md" fullHeight>
      <Container
        title={
          <>
            Deployment manifest
            <br />#{deployment.id}
          </>
        }
        actions={
          <ToggleButtonGroup
            value={mode}
            exclusive
            className="bg-blue-10"
            onChange={(_, val) => {
              if (val !== null) {
                setMode(val as Mode);
              }
            }}
            aria-label="display mode"
          >
            <ToggleButton
              value="ui"
              aria-label="ui view"
              className="bg-blue-20"
            >
              <span className="fa-solid fa-list text-gray-80" />
            </ToggleButton>
            <ToggleButton
              value="json"
              aria-label="json view"
              className="bg-blue-20"
            >
              <span className="fa-solid fa-code text-gray-80" />
            </ToggleButton>
          </ToggleButtonGroup>
        }
        className="flex flex-col h-full"
      >
        {loading && (
          <div className="flex items-center w-full">
            <Spinner />
          </div>
        )}
        {!loading && error && <InfoBox type={InfoBox.ERROR}>{error}</InfoBox>}
        {!loading && !error && mode === "ui" && (
          <div className="flex flex-col flex-1">
            <div className="m-4">
              <ToggleButtonGroup
                value={tab}
                exclusive
                onChange={(_, val) => {
                  setTab(val as Tab);
                }}
                aria-label="active tab"
                className="bg-blue-10"
              >
                <ToggleButton
                  value="cdn"
                  aria-label="cdn files"
                  className="bg-blue-20 hover:text-gray-80"
                >
                  <span className="text-gray-80">CDN Files</span>
                </ToggleButton>
                <ToggleButton
                  value="redirect"
                  aria-label="redirects"
                  className="bg-blue-20 hover:text-gray-80"
                >
                  <span className="text-gray-80">Redirects</span>
                </ToggleButton>
                <ToggleButton
                  value="serverless"
                  aria-label="serverless"
                  className="bg-blue-20 hover:text-gray-80"
                >
                  <span className="text-gray-80 inline-flex items-center">
                    Serverless{" "}
                    <span
                      className={cn("w-2 h-2 inline-block ml-2 rounded-full", {
                        "bg-green-50": Boolean(manifest.functionHandler),
                        "bg-red-50": !manifest.functionHandler,
                      })}
                    />
                  </span>
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
            {tab === "cdn" &&
              manifest.cdnFiles?.map(file => (
                <div className="bg-blue-10 mx-4 mb-4 p-4" key={file.fileName}>
                  <span className="block font-bold">{file.fileName}</span>
                  <Link
                    to={`${deployment.preview}${file.fileName}`}
                    className="text-xs"
                  >
                    {deployment.preview}
                    {file.fileName}
                  </Link>
                </div>
              ))}
            {tab === "redirect" &&
              (manifest.redirects?.map(r => (
                <div className="bg-blue-10 m-4 p-4" key={r.to}>
                  {r.from}
                  {" => "}
                  {r.to}
                </div>
              )) || (
                <div className="mx-4 py-4 bg-blue-10 flex-1 mb-4 flex flex-col items-center justify-center">
                  <img
                    src={emptyListSvg}
                    alt="Empty redirects"
                    className="max-w-64 mb-8"
                  />
                  <p className="text-center">
                    This deployment has no redirects.
                    <br />
                    Create a top-level{" "}
                    <span className="font-mono text-xs text-white font-bold">
                      redirects.json
                    </span>{" "}
                    to add server side redirects.{" "}
                  </p>
                  <p className="text-center mt-8">
                    <Button href="https://www.stormkit.io/docs/features/redirects-and-path-rewrites">
                      Learn more
                    </Button>
                  </p>
                </div>
              ))}
            {tab === "serverless" && (
              <div className="bg-blue-10 mx-4 p-4">
                {manifest.functionHandler ? (
                  <div>
                    Serverless{" "}
                    <span className="text-green-50 font-bold">enabled</span>.
                    Requests not matching any CDN file will be served from the
                    serverless app.
                  </div>
                ) : (
                  <div>
                    Serverless{" "}
                    <span className="text-red-50 font-bold">not enabled</span>.
                    Only CDN files are served.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {!loading && !error && mode === "json" && (
          <div className="w-full px-4">
            <CodeMirror
              value={JSON.stringify(manifest, null, 2)}
              extensions={[json()]}
              theme="dark"
              readOnly
            />
          </div>
        )}
      </Container>
    </Modal>
  );
};

export default ManifestModal;
