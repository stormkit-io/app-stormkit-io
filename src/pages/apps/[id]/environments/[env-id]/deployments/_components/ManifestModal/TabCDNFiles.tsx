import React, { useMemo, useState } from "react";
import cn from "classnames";
import Link from "~/components/Link";
import InfoBox from "~/components/InfoBoxV2";

interface Props {
  manifest: Manifest;
  deployment: Deployment;
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

const recursiveRender = (deployment: Deployment, treeNode: TreeNode) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="ml-4">
      <button
        type="button"
        className="bg-blue-10 p-4 flex w-full items-center font-bold justify-start"
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
      <div className={cn("mt-4", { "border-l border-blue-20 pl-4": expanded })}>
        {Object.keys(treeNode.folders).map(k => (
          <div key={k} className={cn({ hidden: !expanded }, "ml-0")}>
            {recursiveRender(deployment, treeNode.folders[k])}
          </div>
        ))}

        {expanded &&
          treeNode.files.map(file => (
            <div className="bg-blue-10 mb-4 ml-4 p-4" key={file.fileName}>
              <span className="block font-bold">
                {file.fileName.split("/").pop()}
              </span>
              <Link
                to={`${deployment.preview}${
                  file.fileName === "/index.html" ? "" : file.fileName
                }`}
                className="text-xs block truncate"
              >
                {deployment.preview}
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
          Top level <span className="text-white font-bold">/index.html</span> is
          missing and server side rendering is not detected.{" "}
          <Link
            className="font-bold"
            to="https://www.stormkit.io/docs/troubleshooting#index-html-missing"
            secondary
          >
            Learn more.
          </Link>
        </InfoBox>
      )}
      {recursiveRender(deployment, tree["/"])}
    </>
  );
};

export default TabCDNFiles;
