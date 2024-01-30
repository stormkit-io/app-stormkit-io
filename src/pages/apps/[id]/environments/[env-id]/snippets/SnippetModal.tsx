import React, { useState, useContext } from "react";
import { html } from "@codemirror/lang-html";
import CodeMirror from "@uiw/react-codemirror";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Button from "@mui/lab/LoadingButton";
import AlertTitle from "@mui/material/AlertTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import Select from "@mui/material/Select";
import Option from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import { AppContext } from "~/pages/apps/[id]/App.context";
import { EnvironmentContext } from "~/pages/apps/[id]/environments/Environment.context";
import Modal from "~/components/Modal";
import { addSnippet, updateSnippet } from "./actions";

interface Props {
  snippet?: Snippet;
  closeModal: () => void;
  setRefreshToken: (t: number) => void;
}

interface FormValues {
  enabled: "on" | "off";
  title: string;
  content: string;
  injectLocation:
    | "head_append"
    | "body_append"
    | "head_prepend"
    | "body_prepend";
}

const SnippetModal: React.FC<Props> = ({
  closeModal,
  snippet,
  setRefreshToken,
}): React.ReactElement => {
  const { app } = useContext(AppContext);
  const { environment } = useContext(EnvironmentContext);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [codeContent, setCodeContent] = useState(
    snippet?.content || "<script>\n    console.log('Hello world');\n</script>"
  );

  return (
    <Modal open onClose={closeModal}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">
          {snippet?.id ? "Edit snippet" : "Create snippet"}
        </Typography>
        <Typography variant="subtitle2" sx={{ opacity: 0.5, mb: 2 }}>
          Snippets will be injected during response time into your document.
          <br />
          You can enable or disable any snippet without the need of a
          deployment.
        </Typography>
        <Box
          component="form"
          onSubmit={e => {
            e.preventDefault();

            setLoading(true);
            setError(undefined);

            const handler = snippet?.id ? updateSnippet : addSnippet;
            const values = Object.fromEntries(
              new FormData(e.target as HTMLFormElement).entries()
            ) as unknown as FormValues;

            const [location, prependOrAppend] =
              values.injectLocation.split("_");

            handler({
              appId: app.id,
              envId: environment.id!,
              snippet: {
                id: snippet?.id,
                title: values.title,
                content: values.content,
                enabled: values.enabled === "on",
                location: location === "head" ? "head" : "body",
                prepend: prependOrAppend === "prepend",
              },
            })
              .then(() => {
                setRefreshToken(Date.now());
                closeModal();
              })
              .catch(e => {
                if (typeof e === "string") {
                  setError(e);
                } else {
                  setError("Something went wrong while saving snippet.");
                }
              })
              .finally(() => {
                setLoading(false);
              });
          }}
        >
          <Box sx={{ mb: 2 }}>
            <TextField
              label="Title"
              name="title"
              fullWidth
              defaultValue={snippet?.title || ""}
              variant="filled"
              autoComplete="off"
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <input name="content" type="hidden" value={codeContent} />
            <Box sx={{ bgcolor: "rgba(0,0,0,0.1)" }}>
              <CodeMirror
                minHeight="200px"
                maxHeight="200px"
                value={codeContent}
                extensions={[html()]}
                onChange={value => setCodeContent(value)}
                theme="dark"
              />
            </Box>
          </Box>
          <Box sx={{ mb: 2 }}>
            <FormControl variant="standard" fullWidth>
              <InputLabel id="inject-location" sx={{ pl: 2, pt: 1 }}>
                Where to inject
              </InputLabel>
              <Select
                labelId="inject-location"
                name="injectLocation"
                variant="filled"
                fullWidth
                defaultValue={`${snippet?.location || "head"}_${
                  snippet?.prepend ? "prepend" : "append"
                }`}
              >
                <Option value="head_append">
                  Append to Head {"(inserted before </head>)"}
                </Option>
                <Option value="head_prepend">
                  Prepend to Head {"(inserted after <head>)"}
                </Option>
                <Option value="body_append">
                  Append to Body {"(inserted after <body>)"}
                </Option>
                <Option value="body_prepend">
                  Prepend to Body {"(inserted before </head>)"}
                </Option>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ bgcolor: "rgba(0,0,0,0.2)", p: 1.75, pt: 1, mb: 2 }}>
            <FormControlLabel
              sx={{ pl: 0, ml: 0 }}
              label="Enabled"
              control={
                <Switch
                  name="enabled"
                  color="secondary"
                  defaultChecked={snippet?.enabled || false}
                />
              }
              labelPlacement="start"
            />
            <Typography sx={{ opacity: 0.5 }}>
              Turn this feature on to automatically publish successful
              deployments on the default branch.
            </Typography>
          </Box>
          {error && (
            <Alert color="error">
              <AlertTitle>Error</AlertTitle>
              <Typography>{error}</Typography>
            </Alert>
          )}
          <div className="flex justify-center items-center my-4">
            <Button color="info" type="button" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              sx={{ ml: 2 }}
              loading={loading}
            >
              {snippet ? "Update" : "Create"}
            </Button>
          </div>
        </Box>
      </Box>
    </Modal>
  );
};

export default SnippetModal;
