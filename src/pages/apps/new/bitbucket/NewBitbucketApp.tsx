import React, { useState } from "react";
import CenterLayout from "~/layouts/CenterLayout";
import { BackButton } from "~/components/Buttons";
import Container from "~/components/Container";
import RepoList from "../_components/RepoList";
import { useFetchRepos } from "./actions";

const Provider: React.FC = () => {
  const [page, setPage] = useState(1);
  const { repos, hasNextPage, error, loading, isLoadingMore } = useFetchRepos({
    page,
  });

  return (
    <CenterLayout>
      <Container
        className="flex-1"
        title={
          <>
            <BackButton to="/" className="ml-0 mr-2" /> Import app from
            Bitbucket
          </>
        }
      >
        <div className="p-4 pt-0">
          <RepoList
            repositories={repos}
            provider="bitbucket"
            error={error}
            loading={loading}
            isLoadingMore={isLoadingMore}
            hasNextPage={hasNextPage}
            onNextPage={() => setPage(page + 1)}
          />
        </div>
      </Container>
    </CenterLayout>
  );
};

export default Provider;
