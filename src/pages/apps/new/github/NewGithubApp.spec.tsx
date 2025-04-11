import type { RenderResult } from "@testing-library/react";
import { Scope } from "nock";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { fireEvent, waitFor, screen } from "@testing-library/react";
import { AuthContext } from "~/pages/auth/Auth.context";
import * as nocks from "~/testing/nocks/nock_github";
import { mockFetchInstanceDetails } from "~/testing/nocks/nock_user";
import { mockUser } from "~/testing/data";
import NewGithubApp from "./NewGithubApp";
import { renderWithRouter } from "~/testing/helpers";

const { mockFetchInstallations, mockFetchRepositories } = nocks;

interface Props {
  github?: string;
}

describe("~/pages/apps/new/github/NewGithubApp.tsx", () => {
  let wrapper: RenderResult;
  let user: User;
  let fetchInstanceDetailsScope: Scope;

  const findOption = (text: string) => screen.getByText(text);

  const createWrapper = async (props?: Props) => {
    if (!fetchInstanceDetailsScope) {
      fetchInstanceDetailsScope = mockFetchInstanceDetails({
        response: {
          update: { api: false },
          auth: { github: props?.github || "stormkit-dev" },
        },
      });
    }

    user = mockUser();
    wrapper = renderWithRouter({
      el: () => (
        <AuthContext.Provider value={{ user }}>
          <NewGithubApp />
        </AuthContext.Provider>
      ),
    });

    await waitFor(() => {
      expect(fetchInstanceDetailsScope.isDone()).toBe(true);
    });
  };

  describe("github account", () => {
    const account = "my-stormkit-app";

    beforeEach(async () => {
      mockFetchInstallations({
        response: {
          accounts: [],
        },
      });

      await createWrapper({ github: account });
    });

    it("clicking connect more should open a popup so that the user can configure permissions", () => {
      window.open = vi.fn();
      const button = wrapper.getByText("Connect more repositories");
      fireEvent.click(button);
      expect(window.open).toHaveBeenCalledWith(
        `https://github.com/apps/${account}/installations/new`,
        "Add repository",
        "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=1000,height=600,left=100,top=100"
      );
    });
  });

  describe("empty data", () => {
    beforeEach(async () => {
      mockFetchInstallations({
        response: {
          accounts: [],
        },
      });

      await createWrapper();
    });

    it("no connected accounts should display a warning", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("No connected accounts found")).toBeTruthy();
      });
    });
  });

  describe("fetching data", () => {
    const installationId = "5818";
    const installationId2 = "5911";

    beforeEach(async () => {
      const scope1 = mockFetchInstallations({
        response: {
          accounts: [
            {
              id: installationId,
              login: "jdoe",
              avatarUrl: "https://example.com/jdoe",
            },
            {
              id: installationId2,
              login: "jane",
              avatarUrl: "https://example.com/jane",
            },
          ],
        },
      });

      const scope2 = mockFetchRepositories({
        installationId,
        page: 1,
        search: "",
        response: {
          hasNextPage: false,
          repos: [
            {
              name: "simple-project",
              fullName: "jdoe/simple-project",
            },
          ],
        },
      });

      await createWrapper();

      await waitFor(() => {
        expect(scope1.isDone()).toBe(true);
        expect(scope2.isDone()).toBe(true);
      });
    });

    it("should have a proper title", () => {
      expect(wrapper.getByText("Import from GitHub")).toBeTruthy();
    });

    it("should render repositories and the selected account", async () => {
      await waitFor(() => {
        expect(wrapper.getByText("jdoe")).toBeTruthy();
        expect(wrapper.getByText("simple-project")).toBeTruthy();
      });
    });

    it("selecting a different account should trigger a refetch", async () => {
      const scope = mockFetchRepositories({
        installationId: installationId2,
        page: 1,
        search: "",
        response: {
          hasNextPage: false,
          repos: [
            {
              name: "sample-project",
              fullName: "jane/sample-project",
            },
          ],
        },
      });

      await waitFor(() => {
        expect(wrapper.getByText("simple-project")).toBeTruthy();
      });

      const input = wrapper.getByRole("combobox");

      await waitFor(() => {
        expect(findOption("jdoe")).toBeTruthy();
      });

      expect(input).toBeTruthy();
      fireEvent.mouseDown(input);

      await waitFor(() => {
        expect(findOption("jane")).toBeTruthy();
      });

      fireEvent.click(wrapper.getByText("jane"));

      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
        expect(wrapper.getByText("sample-project")).toBeTruthy();
      });
    });
  });
});
