import nock from "nock";
import { fireEvent, waitFor } from "@testing-library/react";
import { withUserContext } from "~/testing/helpers";

describe("pages/apps/new/[provider]", () => {
  let wrapper;

  describe.each`
    provider
    ${"github"}
    ${"gitlab"}
    ${"bitbucket"}
  `("when user is not authenticated", ({ provider }) => {
    describe(provider, () => {
      beforeEach(() => {
        wrapper = withUserContext({
          path: `/apps/new/${provider}`,
        });
      });

      test("should show a login screen", async () => {
        await waitFor(() => {
          expect(
            wrapper.getByText(
              "Seems like we lack your access token. Please authenticate using the button below in order to continue."
            )
          ).toBeTruthy();
        });
      });
    });
  });

  describe("github", () => {
    const provider = "github";

    beforeEach(() => {
      global.GITHUB_ACCESS_TOKEN = "access-token";

      nock("https://api.github.com")
        .get("/user")
        .reply(200, {
          username: "stormkit-dev",
          avatar_url: "http://localhost/my-avatar.jpg",
          id: "151851",
        });
    });

    afterEach(() => {
      delete global.GITHUB_ACCESS_TOKEN;
    });

    describe("when user is authenticated and has no repos", () => {
      beforeEach(() => {
        nock("https://api.github.com")
          .get("/user/installations?page=1&per_page=25")
          .reply(200, []);

        wrapper = withUserContext({
          path: `/apps/new/${provider}`,
        });
      });

      test("should show an error when no repo is found", async () => {
        await waitFor(() => {
          expect(
            wrapper.getByText(
              /We could not fetch any repository. Please make sure Stormkit has the necessary permissions granted/
            )
          ).toBeTruthy();
        });
      });

      test("should display connect repositories and no load more", async () => {
        await waitFor(() => {
          expect(wrapper.getByText("Connect repositories")).toBeTruthy();
          expect(() => wrapper.getByText("Load more")).toThrow();
        });
      });
    });

    describe("when user is authenticated and has repos", () => {
      beforeEach(() => {
        nock("https://api.github.com")
          .get("/user/installations?page=1&per_page=25")
          .reply(200, {
            total_count: 2,
            installations: [
              {
                id: "1256156",
                account: {
                  login: "stormkit-dev",
                  avatar_url: "http://localhost/my-image.jpg",
                },
              },
              {
                id: "1236717",
                account: {
                  login: "stormkit-io",
                  avatar_url: "http://localhost/my-image-2.jpg",
                },
              },
            ],
          });

        nock("https://api.github.com")
          .get("/user/installations/1256156/repositories?page=1&per_page=25")
          .reply(200, {
            total_count: 30,
            repositories: [...Array(25)].map((_, i) => ({
              name: `my-repo-${i}`,
              full_name: `stormkit-dev/my-repo-${i}`,
            })),
          });

        wrapper = withUserContext({
          path: `/apps/new/${provider}`,
        });
      });

      test("should display stormkit-dev as the selected account", async () => {
        await waitFor(() => {
          expect(wrapper.getByText(/stormkit-dev/)).toBeTruthy();
        });
      });

      test("should display a list of repositories", async () => {
        await waitFor(() => {
          expect(wrapper.getByText(/my-repo-1\b/)).toBeTruthy();
          expect(wrapper.getByText(/my-repo-2\b/)).toBeTruthy();
        });
      });

      test("should display a load more when total_count > repo count", async () => {
        let button;

        const scope = nock("https://api.github.com")
          .get("/user/installations/1256156/repositories?page=2&per_page=25")
          .reply(200, { repositories: [] });

        await waitFor(() => {
          button = wrapper.getByText("Load more");
        });

        fireEvent.click(button);

        expect(scope.isDone()).toBe(true);
      });

      test("should display connect more repositories", async () => {
        await waitFor(() => {
          expect(wrapper.getByText("Connect more repositories")).toBeTruthy();
        });
      });
    });
  });

  describe("gitlab", () => {
    const provider = "gitlab";

    beforeEach(() => {
      global.GITLAB_ACCESS_TOKEN = "access-token";

      nock("https://gitlab.com/api/v4")
        .get("/user")
        .reply(200, {
          username: "stormkit-dev",
          avatar_url: "http://localhost/my-avatar.jpg",
          id: "151851",
        });
    });

    afterEach(() => {
      delete global.GITLAB_ACCESS_TOKEN;
    });

    describe("when user is authenticated and has no repos", () => {
      beforeEach(() => {
        nock("https://gitlab.com/api/v4")
          .get("/projects?membership=true&order_by=id&per_page=20")
          .reply(200, []);

        global.GITLAB_ACCESS_TOKEN = "access-token";

        wrapper = withUserContext({
          path: `/apps/new/${provider}`,
        });
      });

      test("should show an error when no repo is found", async () => {
        await waitFor(() => {
          expect(
            wrapper.getByText(
              /We could not fetch any repository. Please make sure Stormkit has the necessary permissions granted/
            )
          ).toBeTruthy();
        });
      });
    });

    describe("when user is authenticated and has repos", () => {
      let repositories = [
        { name: "my-repo", path_with_namespace: "stormkit-dev/my-repo" },
        {
          name: "my-other-repo",
          path_with_namespace: "stormkit-dev/my-other-repo",
        },
      ];

      beforeEach(() => {
        nock("https://gitlab.com/api/v4")
          .get("/projects?membership=true&order_by=id&per_page=20")
          .reply(200, repositories);

        wrapper = withUserContext({
          path: `/apps/new/${provider}`,
        });
      });

      test("should display stormkit-dev as the selected account", async () => {
        await waitFor(() => {
          expect(wrapper.getByText(/stormkit-dev/)).toBeTruthy();
        });
      });

      test("should display a list of repositories", async () => {
        await waitFor(() => {
          expect(wrapper.getByText(/my-repo/)).toBeTruthy();
          expect(wrapper.getByText(/my-other-repo/)).toBeTruthy();
        });
      });

      test("should not display load more", async () => {
        await waitFor(() => {
          expect(() => wrapper.getByText("Load more")).toThrow();
        });
      });
    });

    describe("when user is authenticated and has a lot repos", () => {
      let repositories = [
        { name: "my-repo", path_with_namespace: "stormkit-dev/my-repo" },
        {
          name: "my-other-repo",
          path_with_namespace: "stormkit-dev/my-other-repo",
        },
      ];

      beforeEach(() => {
        nock("https://gitlab.com/api/v4")
          .get("/projects?membership=true&order_by=id&per_page=20")
          .reply(200, repositories, { "X-Next-Page": "true" });

        wrapper = withUserContext({
          path: `/apps/new/${provider}`,
        });
      });

      test("should display load more", async () => {
        await waitFor(() => {
          expect(wrapper.getByText("Load more")).toBeTruthy();
        });
      });
    });
  });

  describe("bitbucket", () => {
    const provider = "bitbucket";

    beforeEach(() => {
      global.BITBUCKET_ACCESS_TOKEN = "access-token";

      nock("https://api.bitbucket.org/2.0")
        .get("/user")
        .reply(200, {
          nickname: "stormkit-dev",
          links: {
            avatar: {
              href: "http://localhost/my-avatar.jpg",
            },
          },
        });

      nock("https://api.bitbucket.org/2.0")
        .get("/teams?role=admin")
        .reply(200, {
          values: [
            {
              username: "stormkit-io",
              links: {
                avatar: {
                  href: "http://localhost/my-team-avatar.jpg",
                },
              },
            },
          ],
        });
    });

    afterEach(() => {
      delete global.BITBUCKET_ACCESS_TOKEN;
    });

    describe("when user is authenticated and has no repos", () => {
      beforeEach(() => {
        nock("https://api.bitbucket.org/2.0")
          .get("/repositories?pagelen=100&role=admin")
          .reply(200, {
            values: [],
          });

        wrapper = withUserContext({
          path: `/apps/new/${provider}`,
        });
      });

      test("should show the selected account", async () => {
        await waitFor(() => {
          expect(wrapper.getByText("stormkit-dev")).toBeTruthy();
        });
      });

      test("should show an error when no repo is found", async () => {
        await waitFor(() => {
          expect(
            wrapper.getByText(
              /We could not fetch any repository. Please make sure Stormkit has the necessary permissions granted/
            )
          ).toBeTruthy();
        });
      });
    });

    describe("when user is authenticated and has repos", () => {
      beforeEach(() => {
        nock("https://api.bitbucket.org/2.0")
          .get("/repositories?pagelen=100&role=admin")
          .reply(200, {
            values: [
              { name: "my-repo", full_name: "stormkit-dev/my-repo" },
              {
                name: "my-other-repo",
                full_name: "stormkit-dev/my-other-repo",
              },
            ],
          });

        wrapper = withUserContext({
          path: `/apps/new/${provider}`,
        });
      });

      test("should display stormkit-dev as the selected account", async () => {
        await waitFor(() => {
          expect(wrapper.getByText(/stormkit-dev/)).toBeTruthy();
        });
      });

      test("should display a list of repositories", async () => {
        await waitFor(() => {
          expect(wrapper.getByText(/my-repo/)).toBeTruthy();
          expect(wrapper.getByText(/my-other-repo/)).toBeTruthy();
        });
      });
    });
  });
});
