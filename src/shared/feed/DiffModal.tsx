import Box from "@mui/material/Box";
import { json } from "@codemirror/lang-json";
import Button from "@mui/material/Button";
import CodeMirror from "@uiw/react-codemirror";
import Typography from "@mui/material/Typography";
import Modal from "~/components/Modal";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import CardFooter from "~/components/CardFooter";

interface Props {
  audit: Audit;
  onClose: () => void;
}

export default function DiffModal({ onClose, audit }: Props) {
  return (
    <Modal open maxWidth="lg" onClose={onClose}>
      <Card>
        <CardHeader
          title="Diff"
          subtitle="Visualize changes with this activity item"
        />
        <Box sx={{ display: "flex", mb: 4 }}>
          <Box
            sx={{
              flex: 1,
              mr: 2,
              maxWidth: "50%",
            }}
          >
            <Typography sx={{ mb: 2 }} variant="h4">
              Old Version
            </Typography>
            <CodeMirror
              basicSetup={{ lineNumbers: false, foldGutter: false }}
              value={JSON.stringify(audit.diff.old, null, 2)}
              extensions={[json()]}
              readOnly
              theme="dark"
            />
          </Box>
          <Box
            sx={{
              flex: 1,
              maxWidth: "50%",
              width: "100%",
            }}
          >
            <Typography sx={{ mb: 2 }} variant="h4">
              New Version
            </Typography>
            <CodeMirror
              basicSetup={{ lineNumbers: false, foldGutter: false }}
              value={JSON.stringify(audit.diff.new, null, 2)}
              extensions={[json()]}
              readOnly
              theme="dark"
            />
          </Box>
        </Box>
        <CardFooter>
          <Button variant="contained" color="secondary" onClick={onClose}>
            Close
          </Button>
        </CardFooter>
      </Card>
    </Modal>
  );
}
