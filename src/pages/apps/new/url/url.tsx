import { useState } from "react";
import { useNavigate } from "react-router";
import { useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import LoadingButton from "@mui/lab/LoadingButton";
import ContainerV2 from "~/components/ContainerV2";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { insertRepo } from "../_components/actions";

interface URLError {
  title: string;
  content: string;
}

export default function ImportURL() {
  const [searchParams] = useSearchParams();
  const defaultURL = searchParams.get("r") || "";
  const [importUrl, setImportUrl] = useState<string>(defaultURL);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<URLError>();
  const navigate = useNavigate();

  const handleRepoInsert = () => {
    let provider: Provider | undefined;
    let repoName: string | undefined;

    try {
      const parsed = new URL(importUrl);
      repoName = parsed.pathname.replace(/^\/+/, "").replace(".git", "");
      provider = parsed.hostname.includes("github")
        ? "github"
        : parsed.hostname.includes("gitlab")
        ? "gitlab"
        : parsed.hostname.includes("bitbucket")
        ? "bitbucket"
        : undefined;
    } catch {}

    if (!provider || !repoName) {
      return setError({
        title: "Invalid Provider",
        content:
          "Make sure to import the repository from one these providers: GitLab, GitHub, Bitbucket.",
      });
    }

    setIsLoading(true);
    setError(undefined);

    insertRepo({
      provider: "github",
      repo: repoName,
    })
      .then(app => {
        navigate(`/apps/${app.id}/environments`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <ContainerV2
      title={
        <Typography>
          <Link
            href="/"
            sx={{
              color: "white",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            <ArrowBack sx={{ mr: 1 }} />
            Import from URL
          </Link>
        </Typography>
      }
    >
      <Box sx={{ px: 2, pb: 2 }}>
        <TextField
          color="info"
          variant="filled"
          label="Where can we find the repository?"
          placeholder="https://github.com/stormkit-io/marketplace-feedback-form"
          fullWidth
          autoComplete="off"
          value={importUrl}
          onChange={e => setImportUrl(e.currentTarget.value)}
        />
      </Box>
      {error && (
        <Alert sx={{ mx: 2, mb: 2 }} variant="filled" color="error">
          <AlertTitle>{error.title}</AlertTitle>
          <Typography>{error.content}</Typography>
        </Alert>
      )}
      <Box sx={{ px: 2, pb: 2, textAlign: "right" }}>
        <LoadingButton
          loading={isLoading}
          variant="contained"
          color="secondary"
          onClick={handleRepoInsert}
        >
          Import repo
        </LoadingButton>
      </Box>
    </ContainerV2>
  );
}
