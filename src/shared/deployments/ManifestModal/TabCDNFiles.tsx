import React, { useMemo, useState } from "react";
import cn from "classnames";
import Box from "@mui/material/Box";
import Link from "~/components/Link";
import InfoBox from "~/components/InfoBoxV2";

interface Props {
  manifest: Manifest;
  deployment: DeploymentV2;
}

interface TreeNode {
  currentFolder: string;
  files: CDNFile[];
  folders: Record<string, TreeNode>;
}

type Tree = Record<string, TreeNode>;

const useTree = ({ manifest }: { manifest: Manifest }) => {
  return useMemo(() => {
    const tree: Tree = {
      "/": {
        currentFolder: "/",
        files: [],
        folders: {},
      },
    };

    const recursiveFolder = (
      object: Record<string, TreeNode>,
      path: string,
      item: CDNFile
    ) => {
      object[path] = object[path] || {
        files: [],
        folders: {},
        currentFolder: path,
      };
      object[path].files.push(item);
      return object;
    };

    manifest.cdnFiles?.forEach(file => {
      const pieces = file.fileName.replace(/^\//, "").split("/");

      if (pieces.length === 1) {
        tree["/"].files.push(file);
      } else {
        let lastLeaf = tree["/"].folders;

        pieces.pop(); // last name is file name
        pieces.forEach(path => {
          recursiveFolder(lastLeaf, path, file);
          lastLeaf = lastLeaf[path].folders;
        });
      }
    });

    return tree;
  }, [manifest.cdnFiles]);
};

const recursiveRender = (deployment: DeploymentV2, treeNode: TreeNode) => {
  const isRoot = treeNode.currentFolder === "/";
  const [expanded, setExpanded] = useState(isRoot);

  return (
    <div>
      {!isRoot && (
        <button
          type="button"
          className="bg-blue-10 p-3 flex w-full items-center font-bold justify-start"
          style={{ minHeight: "53px" }}
          onClick={() => {
            setExpanded(!expanded);
          }}
        >
          <span
            className={cn("fas w-6 text-left", {
              "fa-chevron-right": !expanded,
              "fa-chevron-down": expanded,
            })}
          />
          {treeNode.currentFolder}
        </button>
      )}
      <div
        className={cn({
          "mt-3": !isRoot,
          "border-l border-blue-20 pl-3": expanded && !isRoot,
        })}
      >
        {Object.keys(treeNode.folders).map(k => (
          <div key={k} className={cn({ hidden: !expanded, "ml-0": !isRoot })}>
            {recursiveRender(deployment, treeNode.folders[k])}
          </div>
        ))}
        {expanded &&
          treeNode.files.map(file => (
            <div className="bg-blue-10 mb-3 p-3" key={file.fileName}>
              <span className="block font-bold">
                {file.fileName.split("/").pop()}
              </span>
              <Link
                to={`${deployment.previewUrl}${
                  file.fileName === "/index.html" ? "" : file.fileName
                }`}
                className="text-xs block truncate"
              >
                {deployment.previewUrl}
                {file.fileName}
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

const TabCDNFiles: React.FC<Props> = ({ manifest, deployment }) => {
  const ssrEnabled = Boolean(manifest?.functionHandler);
  const indexHTMLWarning =
    !ssrEnabled &&
    !manifest?.cdnFiles?.find(file => file.fileName === "/index.html");

  const tree = useTree({ manifest });

  return (
    <>
      {indexHTMLWarning && (
        <InfoBox type={InfoBox.WARNING} className="mx-4 mb-4">
          Top level <span className="font-bold">/index.html</span> is missing
          and server side rendering is not detected.{" "}
          <Link
            className="font-bold"
            to="https://www.stormkit.io/docs/other/troubleshooting#index-html-missing"
          >
            Learn more.
          </Link>
        </InfoBox>
      )}
      <Box>{recursiveRender(deployment, tree["/"])}</Box>
    </>
  );
};

export default TabCDNFiles;
