import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import cn from "classnames";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import Modal from "~/components/Modal";
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
      <Card sx={{ height: "100%" }}>
        <CardHeader
          actions={
            <ToggleButtonGroup
              value={mode}
              exclusive
              sx={{ bgcolor: "rgba(0,0,0,0.3)" }}
              onChange={(_, val) => {
                if (val !== null) {
                  setMode(val as Mode);
                }
              }}
              aria-label="display mode"
            >
              <ToggleButton value="ui" aria-label="ui view">
                <span className="fa-solid fa-list text-gray-80" />
              </ToggleButton>
              <ToggleButton value="json" aria-label="json view">
                <span className="fa-solid fa-code text-gray-80" />
              </ToggleButton>
            </ToggleButtonGroup>
          }
        >
          <Typography>
            Deployment manifest
            <br />#{deployment.id}
          </Typography>
        </CardHeader>
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
            <Box sx={{ mb: 4 }}>
              <ToggleButtonGroup
                value={tab}
                exclusive
                sx={{ bgcolor: "rgba(0,0,0,0.3)" }}
                onChange={(_, val) => {
                  setTab(val as Tab);
                }}
                aria-label="active tab"
              >
                <ToggleButton value="cdn" aria-label="cdn files">
                  <Typography>CDN Files</Typography>
                </ToggleButton>
                <ToggleButton value="redirect" aria-label="redirects">
                  <Typography>Redirects</Typography>
                </ToggleButton>
                <ToggleButton value="ssr" aria-label="server side rendering">
                  <Typography
                    sx={{ display: "inline-flex", alignItems: "center" }}
                  >
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
                  </Typography>
                </ToggleButton>
                <ToggleButton value="api" aria-label="rest api">
                  <Typography
                    sx={{ display: "inline-flex", alignItems: "center" }}
                  >
                    REST API{" "}
                    <span
                      className={cn("w-2 h-2 inline-block ml-2 rounded-full", {
                        "bg-red-50": !apiEnabled,
                        "bg-green-50": apiEnabled,
                      })}
                    />
                  </Typography>
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            {tab === "cdn" && (
              <TabCDNFiles manifest={manifest} deployment={deployment} />
            )}
            {tab === "redirect" && (
              <TabRedirects redirects={manifest.redirects} />
            )}
            {tab === "ssr" && (
              <Alert sx={{ mb: 4 }}>
                <Box>
                  <AlertTitle>
                    {ssrEnabled ? "SSR Detected" : "SSR Not detected"}
                  </AlertTitle>
                  <Typography>
                    {ssrEnabled
                      ? "Requests not matching any CDN file will be served from the serverless app."
                      : "Requests will try to match CDN files and return 404 if not found."}
                  </Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    href="https://www.stormkit.io/docs/deployments/how-do-we-deploy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn more
                  </Button>
                </Box>
              </Alert>
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
          <CodeMirror
            value={JSON.stringify(manifest, null, 2)}
            extensions={[json()]}
            theme="dark"
            readOnly
          />
        )}
      </Card>
    </Modal>
  );
};

export default ManifestModal;
