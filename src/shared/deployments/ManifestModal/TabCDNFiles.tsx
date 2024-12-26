import { useMemo, useState } from "react";
import WarningIcon from "@mui/icons-material/Warning";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

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
    <Box>
      {!isRoot && (
        <Button
          type="button"
          sx={{
            width: "100%",
            minHeight: "53px",
            bgcolor: "container.transparent",
            display: "flex",
            justifyContent: "flex-start",
            flex: 1,
            p: 2,
          }}
          onClick={() => {
            setExpanded(!expanded);
          }}
        >
          <ChevronRight
            sx={{
              transform: expanded ? "rotate(90deg)" : undefined,
              ml: 0,
              mr: 0.5,
            }}
          />
          {treeNode.currentFolder}
        </Button>
      )}
      <Box
        sx={{
          mt: isRoot ? 0 : 2,
          pl: expanded && !isRoot ? 2 : 0,
          borderLeft: expanded && !isRoot ? "1px solid" : "none",
          borderColor: "container.transparent",
        }}
      >
        {Object.keys(treeNode.folders).map(k => (
          <Box
            key={k}
            sx={{
              display: !expanded ? "none" : undefined,
              ml: isRoot ? undefined : 0,
            }}
          >
            {recursiveRender(deployment, treeNode.folders[k])}
          </Box>
        ))}
        {expanded &&
          treeNode.files.map(file => (
            <Box
              sx={{ bgcolor: "container.transparent", mb: 2, p: 2 }}
              key={file.fileName}
            >
              <span className="block font-bold">
                {file.fileName.split("/").pop()}
              </span>
              <Link
                href={`${deployment.previewUrl}${
                  file.fileName === "/index.html" ? "" : file.fileName
                }`}
                sx={{
                  fontSize: "0.75rem",
                  display: "block",
                  overflow: "hidden",
                }}
              >
                {deployment.previewUrl}
                {file.fileName}
              </Link>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default function TabCDNFiles({ manifest, deployment }: Props) {
  const ssrEnabled = Boolean(manifest?.functionHandler);
  const indexHTMLWarning =
    (!ssrEnabled &&
      !manifest?.cdnFiles?.find(file => file.fileName === "/index.html")) ||
    true;

  const tree = useTree({ manifest });

  return (
    <>
      {indexHTMLWarning && (
        <Alert color="warning" sx={{ mb: 2 }} icon={<WarningIcon />}>
          <Typography>
            Top level <span className="font-bold">/index.html</span> is missing
            and server side rendering is not detected.{" "}
            <Link href="https://www.stormkit.io/docs/other/troubleshooting#index-html-missing">
              Learn more.
            </Link>
          </Typography>
        </Alert>
      )}
      <Box>{recursiveRender(deployment, tree["/"])}</Box>
    </>
  );
}
