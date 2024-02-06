import React, { useState, useContext, FormEventHandler } from "react";
import { html } from "@codemirror/lang-html";
import CodeMirror from "@uiw/react-codemirror";
import Box from "@mui/material/Box";
import Button from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import Select from "@mui/material/Select";
import Option from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputLabel from "@mui/material/InputLabel";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";
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
  hosts: string;
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

  const handleSubmit: FormEventHandler = e => {
    e.preventDefault();

    setLoading(true);
    setError(undefined);

    const handler = snippet?.id ? updateSnippet : addSnippet;
    const values = Object.fromEntries(
      new FormData(e.target as HTMLFormElement).entries()
    ) as unknown as FormValues;

    const [location, prependOrAppend] = values.injectLocation.split("_");
    const hosts = values.hosts
      .split(",")
      .map(i => i.trim().toLowerCase())
      .filter(i => i);

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
        rules: hosts?.length ? { hosts } : undefined,
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
  };

  return (
    <Modal open onClose={closeModal}>
      <Card component="form" error={error} onSubmit={handleSubmit}>
        <CardHeader
          title={snippet?.id ? "Edit snippet" : "Create snippet"}
          subtitle={
            <>
              Snippets will be injected during response time into your document.
              <br />
              You can enable or disable any snippet without the need of a
              deployment.
            </>
          }
        />
        <Box sx={{ mb: 4 }}>
          <TextField
            label="Title"
            name="title"
            fullWidth
            defaultValue={snippet?.title || ""}
            variant="filled"
            autoComplete="off"
            autoFocus
            helperText="The title will be used internally to distinguish between snippets."
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
        <Box sx={{ mb: 4 }}>
          <input name="content" type="hidden" value={codeContent} />
          <Box sx={{ bgcolor: "rgba(0,0,0,0.1)", fontSize: 12 }}>
            <CodeMirror
              maxHeight="200px"
              value={codeContent}
              extensions={[html()]}
              onChange={value => setCodeContent(value)}
              theme="dark"
            />
          </Box>
        </Box>
        <Box sx={{ mb: 4 }}>
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
        <Box sx={{ mb: 4 }}>
          <TextField
            label="Hosts"
            name="hosts"
            fullWidth
            defaultValue={snippet?.rules?.hosts?.join(", ") || ""}
            variant="filled"
            autoComplete="off"
            helperText="Limit this snippet to specified hosts. Separate multiple hosts with a comma `,`."
            InputLabelProps={{
              shrink: true,
            }}
          />
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
          <Typography sx={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 11 }}>
            Turn this feature on to automatically publish successful deployments
            on the default branch.
          </Typography>
        </Box>
        <CardFooter>
          <Button type="button" onClick={closeModal}>
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
        </CardFooter>
      </Card>
    </Modal>
  );
};

export default SnippetModal;
