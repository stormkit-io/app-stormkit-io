import React, { useMemo, useState } from "react";
import { Tooltip } from "@mui/material";
import cn from "classnames";
import emptyListSvg from "~/assets/images/empty-list.svg";
import Button from "~/components/ButtonV2";

interface Props {
  manifest: Manifest;
  previewEndpoint: string;
}

interface Endpoint {
  method: string;
  endpoint: string;
  fileName: string;
  curl: string;
}

const methods = ["get", "post", "head", "put", "delete", "patch", "put"];

const TabAPI: React.FC<Props> = ({ manifest, previewEndpoint }) => {
  const [curlCopied, setCurlCopied] = useState<string>();
  const apiEnabled = manifest.apiFiles && manifest.apiFiles?.length > 0;
  const apiFiles: Endpoint[] = useMemo(() => {
    return (
      manifest?.apiFiles?.map(file => {
        const pieces = file.fileName.split(".");
        const methodOrExt = pieces[1]?.toLowerCase();
        const method = methods.find(v => methodOrExt === v) || "ALL";
        const name = pieces[0].replace(/^\//, "").replace(/\[(.*)\]/, ":$1");
        const endpoint = `/api/${name}`.replace("/index", "");

        return {
          method,
          endpoint,
          fileName: file.fileName,
          curl: `curl -X ${
            method === "ALL" ? "GET" : method.toUpperCase()
          } "${previewEndpoint.replace(/\/$/, "")}${endpoint}"`,
        };
      }) || []
    );
  }, [manifest?.apiFiles, previewEndpoint]);

  return (
    <div
      className={cn("mx-4 py-4 flex-1 mb-4 flex flex-col", {
        "bg-blue-10 items-center justify-center": !apiEnabled,
      })}
    >
      {apiEnabled ? (
        apiFiles.map(entry => (
          <div
            key={entry.fileName}
            className="bg-blue-10 mb-4 flex w-full text-gray-80"
          >
            <div className="text-white font-bold p-4 bg-black w-20 flex items-center">
              {entry.method.toUpperCase()}
            </div>
            <div className="p-4 flex-1">
              {entry.endpoint}
              <br />
              <span className="text-xs text-gray-50">{entry.fileName}</span>
            </div>
            <div className="p-4 flex items-start">
              <Tooltip
                title={curlCopied === entry.fileName ? "Copied!" : "Copy CURL"}
              >
                <div>
                  <Button
                    styled={false}
                    onMouseEnter={() => {
                      setCurlCopied(undefined);
                    }}
                    onClick={() => {
                      navigator.clipboard.writeText(entry.curl);
                      setCurlCopied(entry.fileName);
                    }}
                  >
                    <span className="fa-solid fa-copy" />
                  </Button>
                </div>
              </Tooltip>
            </div>
          </div>
        ))
      ) : (
        <>
          <img
            src={emptyListSvg}
            alt="Empty redirects"
            className="max-w-64 mb-8"
          />
          <p className="text-center">
            REST API not detected.
            <br />
            Create a top-level{" "}
            <span className="text-white font-bold">/api</span> folder to get
            started.
          </p>
          <p className="text-center mt-8">
            <Button href="https://www.stormkit.io/docs/features/writing-api">
              Learn more
            </Button>
          </p>
        </>
      )}
    </div>
  );
};

export default TabAPI;
