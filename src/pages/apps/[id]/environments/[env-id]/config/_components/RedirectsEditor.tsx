import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { grey } from "@mui/material/colors";

interface Props {
  value?: string;
  onChange: (r: string) => void;
}

export default function RedirectsEditor({ value, onChange }: Props) {
  return (
    <>
      <CodeMirror
        maxHeight="200px"
        value={value}
        extensions={[json()]}
        onChange={onChange}
        theme="dark"
      />
      <Typography sx={{ mt: 2, color: grey[400] }}>
        Check the{" "}
        <Link
          href={"https://stormkit.io/docs/features/redirects-and-path-rewrites"}
          target="_blank"
          rel="noreferrer noopener"
        >
          docs
        </Link>{" "}
        for more information.
      </Typography>
    </>
  );
}
