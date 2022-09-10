import type { MemoryHistory } from "history";
import type { RenderResult } from "@testing-library/react";
import type { Repo } from "../types.d";
import React from "react";
import { Router } from "react-router";
import { createMemoryHistory } from "history";
import { render, fireEvent, waitFor } from "@testing-library/react";
import * as nocks from "~/testing/nocks";
import RepoList from "./RepoList";

interface Props {
  provider?: Provider;
  loading?: boolean;
  error?: string;
  repositories?: Repo[];
  isLoadingMore?: boolean;
  hasNextPage?: boolean;
  onNextPage?: () => void;
}

describe("~/pages/apps/new/_components/RepoList.tsx", () => {
  let wrapper: RenderResult;
  let history: MemoryHistory;

  const repositories: Repo[] = [
    { name: "test-repo", fullName: "namespace/test-repo" },
    { name: "test-repo-2", fullName: "namespace/test-repo-2" },
  ];

  const createWrapper = ({
    provider = "github",
    loading = false,
    error,
    repositories = [],
    isLoadingMore = false,
    hasNextPage = false,
    onNextPage = () => {},
  }: Props) => {
    history = createMemoryHistory();
    wrapper = render(
      <Router location={history.location} navigator={history}>
        <RepoList
          loading={loading}
          error={error}
          provider={provider}
          repositories={repositories}
          isLoadingMore={isLoadingMore}
          hasNextPage={hasNextPage}
          onNextPage={onNextPage}
        />
      </Router>
    );
  };

  describe("loading", () => {
    test("displays a spinner when loading is true", () => {
      createWrapper({ repositories, loading: true });
      expect(wrapper.getByTestId("repo-list-spinner")).toBeTruthy();
    });

    test("does not display a spinner when loading is false", () => {
      createWrapper({ repositories, loading: false });
      expect(() => wrapper.getByTestId("repo-list-spinner")).toThrow();
    });
  });

  describe("repositories", () => {
    test("displays a list of repositories", () => {
      createWrapper({ repositories });
      expect(wrapper.getByText("test-repo")).toBeTruthy();
      expect(wrapper.getByText("test-repo-2")).toBeTruthy();
    });

    test("inserts a repository when import is clicked", async () => {
      const id = "152591";
      const scope = nocks.mockInsertApp({
        provider: "github",
        repo: "namespace/test-repo",
        id,
      });

      createWrapper({ repositories });
      fireEvent.click(wrapper.getByLabelText("test-repo"));

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
        expect(history.location.pathname).toBe(`/apps/${id}`);
      });
    });

    test("load more", () => {
      const onNextPage = jest.fn();
      createWrapper({ repositories, hasNextPage: true, onNextPage });
      const button = wrapper.getByText("Load more");
      expect(button).toBeTruthy();
      fireEvent.click(button);
      expect(onNextPage).toHaveBeenCalled();
    });
  });
});
