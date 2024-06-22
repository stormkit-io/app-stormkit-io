import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import ArrowBack from "@mui/icons-material/ArrowBack";
import RepoList from "../_components/RepoList";
import { useFetchRepos } from "./actions";

export default function NewGitLabApp() {
  const [page, setPage] = useState(1);
  const { repos, hasNextPage, error, loading, isLoadingMore } = useFetchRepos({
    page,
  });

  return (
    <Box maxWidth="md" sx={{ width: "100%", margin: "0 auto" }}>
      <Card
        sx={{
          width: "100%",
          color: "white",
          mb: 4,
        }}
      >
        <CardHeader>
          <Typography>
            <Link
              sx={{
                display: "inline-flex",
                alignItems: "center",
                color: "white",
              }}
              href="/"
            >
              <ArrowBack sx={{ mr: 1 }} />
              Import from GitLab
            </Link>
          </Typography>
        </CardHeader>
        <RepoList
          repositories={repos}
          provider="gitlab"
          error={error}
          loading={loading}
          isLoadingMore={isLoadingMore}
          hasNextPage={hasNextPage}
          onNextPage={() => setPage(page + 1)}
        />
      </Card>
    </Box>
  );
}
