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
import { useFetchManifest } from "../../actions";
import TabAPI from "./TabAPI";
import TabCDNFiles from "./TabCDNFiles";
import TabRedirects from "./TabRedirects";

interface Props {
  app: App;
  deployment: Deployment;
  onClose: () => void;
}

type Mode = "json" | "ui";
type Tab = "cdn" | "redirect" | "ssr" | "api";

const ManifestModal: React.FC<Props> = ({ app, deployment, onClose }) => {
  const [mode, setMode] = useState<Mode>("ui");
  const [tab, setTab] = useState<Tab>("cdn");

  const { manifest, loading, error } = useFetchManifest({
    appId: app.id,
    deploymentId: deployment.id,
  });

  const apiEnabled = manifest?.apiFiles && manifest.apiFiles?.length > 0;
  const ssrEnabled = Boolean(manifest?.functionHandler);

  return (
    <Modal open onClose={onClose} height="100%">
      <Container
        maxWidth="max-w-none"
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
          <div className="flex justify-center w-full">
            <Spinner />
          </div>
        )}
        {!loading && error && <InfoBox type={InfoBox.ERROR}>{error}</InfoBox>}
        {!loading && !error && !manifest && (
          <div className="bg-blue-10 mx-4 p-4">Manifest is not found.</div>
        )}
        {!loading && !error && manifest && mode === "ui" && (
          <div className="flex flex-col flex-1">
            <div className="m-4">
              <ToggleButtonGroup
                value={tab}
                exclusive
                onChange={(_, val) => {
                  setTab(val as Tab);
                }}
                aria-label="active tab"
                className="bg-pink-10"
              >
                <ToggleButton
                  value="cdn"
                  aria-label="cdn files"
                  className="bg-blue-20 hover:text-gray-80"
                  classes={{
                    root: "border-t-0 border-b-0 border-l-0 border-r-2 border-solid border-blue-10 capitalize",
                  }}
                >
                  <span className="text-gray-80">CDN Files</span>
                </ToggleButton>
                <ToggleButton
                  value="redirect"
                  aria-label="redirects"
                  className="bg-blue-20 hover:text-gray-80"
                  classes={{
                    root: "border-t-0 border-b-0 border-l-0 border-r-2 border-solid border-blue-10 capitalize",
                  }}
                >
                  <span className="text-gray-80">Redirects</span>
                </ToggleButton>
                <ToggleButton
                  value="ssr"
                  aria-label="server side rendering"
                  className="bg-blue-20 hover:text-gray-80"
                  classes={{
                    root: "border-t-0 border-b-0 border-l-0 border-r-2 border-solid border-blue-10 capitalize",
                  }}
                >
                  <span className="text-gray-80 inline-flex items-center">
                    Server side rendering{" "}
                    <span
                      className={cn(
                        "w-2 h-2 inline-block ml-2 rounded-full capitalize",
                        {
                          "bg-green-50": ssrEnabled,
                          "bg-red-50": !ssrEnabled,
                        }
                      )}
                    />
                  </span>
                </ToggleButton>
                <ToggleButton
                  value="api"
                  aria-label="rest api"
                  className="bg-blue-20 hover:text-gray-80"
                  classes={{
                    root: "border-0 border-solid border-black",
                  }}
                >
                  <span className="text-gray-80 inline-flex items-center capitalize">
                    REST API{" "}
                    <span
                      className={cn("w-2 h-2 inline-block ml-2 rounded-full", {
                        "bg-red-50": !apiEnabled,
                        "bg-green-50": apiEnabled,
                      })}
                    />
                  </span>
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
            {tab === "cdn" && (
              <TabCDNFiles manifest={manifest} deployment={deployment} />
            )}
            {tab === "redirect" && (
              <TabRedirects redirects={manifest.redirects} />
            )}
            {tab === "ssr" && (
              <div className="bg-blue-10 mx-4 p-4">
                {ssrEnabled ? (
                  <div>
                    Server side rendering{" "}
                    <span className="text-green-50 font-bold">detected</span>.
                    Requests not matching any CDN file will be served from the
                    serverless app.
                  </div>
                ) : (
                  <div>
                    Server side rendering{" "}
                    <span className="text-red-50 font-bold">not detected</span>.
                    Only CDN files are served.
                  </div>
                )}
              </div>
            )}
            {tab === "api" && (
              <TabAPI
                manifest={manifest}
                previewEndpoint={deployment.preview}
              />
            )}
          </div>
        )}
        {!loading && !error && manifest && mode === "json" && (
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
