import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Card from "~/components/Card";
import CardHeader from "~/components/CardHeader";
import ArrowBack from "@mui/icons-material/ArrowBack";
import RepoList from "../_components/RepoList";
import { useFetchRepos } from "./actions";

export default function NewBitbucketApp() {
  const [page, setPage] = useState(1);
  const { repos, hasNextPage, error, loading, isLoadingMore } = useFetchRepos({
    page,
  });

  return (
    <Box maxWidth="md" sx={{ width: "100%", margin: "0 auto" }}>
      <Card sx={{ width: "100%", mb: 4 }} error={error}>
        <CardHeader>
          <Typography>
            <Link
              sx={{
                display: "inline-flex",
                alignItems: "center",
              }}
              href="/"
            >
              <ArrowBack sx={{ mr: 1 }} />
              Import from Bitbucket
            </Link>
          </Typography>
        </CardHeader>
        <RepoList
          repositories={repos}
          provider="bitbucket"
          isLoadingList={loading}
          isLoadingMore={isLoadingMore}
          hasNextPage={hasNextPage}
          onNextPage={() => setPage(page + 1)}
        />
      </Card>
    </Box>
  );
}
