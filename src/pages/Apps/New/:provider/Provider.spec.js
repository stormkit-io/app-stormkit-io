import { waitFor } from "@testing-library/react";
import { renderWithContext } from "~/testing/helpers";
import Provider from "./Provider";

describe("pages/Apps/New/:provider", () => {
  let wrapper;

  describe.each`
    provider
    ${"github"}
    ${"gitlab"}
    ${"bitbucket"}
  `("when user is not authenticated", ({ provider }) => {
    describe(provider, () => {
      beforeEach(() => {
        wrapper = renderWithContext(Provider, {
          props: { match: { params: { provider } } },
          context: {
            bitbucket: {},
            github: {},
            gitlab: {},
          },
        });
      });

      test("should show a login screen", () => {
        expect(
          wrapper.getByText(
            "Seems like we lack your access token. Please authenticate using the button below in order to continue."
          )
        ).toBeTruthy();
      });
    });
  });

  describe("github", () => {
    const provider = "github";

    describe("when user is authenticated and has no repos", () => {
      beforeEach(() => {
        wrapper = renderWithContext(Provider, {
          props: { match: { params: { provider } } },
          context: {
            github: {
              accessToken: "access-token",
              installations: jest.fn().mockReturnValue({ total_count: 0 }),
            },
          },
        });
      });

      test("should show an error when no repo is found", () => {
        expect(
          wrapper.getByText(
            /We could not fetch any repository. Please make sure Stormkit has the necessary permissions granted/
          )
        ).toBeTruthy();
      });

      test("should display connect repositories", () => {
        expect(wrapper.getByText("Connect repositories")).toBeTruthy();
      });
    });

    describe("when user is authenticated and has repos", () => {
      let installations;
      let repositories;

      beforeEach(() => {
        installations = jest.fn().mockReturnValue({
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

        repositories = jest.fn().mockReturnValue({
          repositories: [
            { name: "my-repo", full_name: "stormkit-dev/my-repo" },
            { name: "my-other-repo", full_name: "stormkit-dev/my-other-repo" },
          ],
        });

        wrapper = renderWithContext(Provider, {
          props: { match: { params: { provider } } },
          context: {
            user: { displayName: "stormkit-dev" },
            github: {
              accessToken: "access-token",
              installations,
              repositories,
            },
          },
        });
      });

      test("should display stormkit-dev as the selected account", () => {
        expect(wrapper.getByText(/stormkit-dev/)).toBeTruthy();
      });

      test("should display a list of repositories", () => {
        expect(wrapper.getByText(/my-repo/)).toBeTruthy();
        expect(wrapper.getByText(/my-other-repo/)).toBeTruthy();
      });

      test("should display connect more repositories", () => {
        expect(wrapper.getByText("Connect more repositories")).toBeTruthy();
      });
    });
  });

  describe("gitlab", () => {
    const provider = "gitlab";
    const user = {
      username: "stormkit-dev",
      avatar_url: "http://localhost/my-avatar.jpg",
      id: "151851",
    };

    describe("when user is authenticated and has no repos", () => {
      beforeEach(() => {
        wrapper = renderWithContext(Provider, {
          props: { match: { params: { provider } } },
          context: {
            gitlab: {
              accessToken: "access-token",
              user: jest.fn().mockReturnValue(user),
              repositories: jest
                .fn()
                .mockReturnValue({ repos: [], nextPage: false }),
            },
          },
        });
      });

      test("should show an error when no repo is found", () => {
        expect(
          wrapper.getByText(
            /We could not fetch any repository. Please make sure Stormkit has the necessary permissions granted/
          )
        ).toBeTruthy();
      });
    });

    describe("when user is authenticated and has repos", () => {
      let repositories;

      beforeEach(() => {
        repositories = jest.fn().mockReturnValue({
          nextPage: false,
          repos: [
            { name: "my-repo", path_with_namespace: "stormkit-dev/my-repo" },
            {
              name: "my-other-repo",
              path_with_namespace: "stormkit-dev/my-other-repo",
            },
          ],
        });

        wrapper = renderWithContext(Provider, {
          props: { match: { params: { provider } } },
          context: {
            user: { displayName: "stormkit-dev" },
            gitlab: {
              accessToken: "access-token",
              user: jest.fn().mockReturnValue(user),
              repositories,
            },
          },
        });
      });

      test("should display stormkit-dev as the selected account", () => {
        expect(wrapper.getByText(/stormkit-dev/)).toBeTruthy();
      });

      test("should display a list of repositories", () => {
        expect(wrapper.getByText(/my-repo/)).toBeTruthy();
        expect(wrapper.getByText(/my-other-repo/)).toBeTruthy();
      });

      test("should not display load more", () => {
        expect(() => wrapper.getByText("Load more")).toThrow();
      });
    });

    describe("when user is authenticated and has a lot of repos", () => {
      let repositories;

      beforeEach(() => {
        repositories = jest.fn().mockReturnValue({
          nextPage: true,
          repos: [
            { name: "my-repo", path_with_namespace: "stormkit-dev/my-repo" },
            {
              name: "my-other-repo",
              path_with_namespace: "stormkit-dev/my-other-repo",
            },
          ],
        });

        wrapper = renderWithContext(Provider, {
          props: { match: { params: { provider } } },
          context: {
            gitlab: {
              accessToken: "access-token",
              user: jest.fn().mockReturnValue(user),
              repositories,
            },
          },
        });
      });

      test("should display load more", () => {
        expect(wrapper.getByText("Load more")).toBeTruthy();
      });
    });
  });

  describe("bitbucket", () => {
    const provider = "bitbucket";
    const user = {
      nickname: "stormkit-dev",
      links: {
        avatar: {
          href: "http://localhost/my-avatar.jpg",
        },
      },
    };

    describe("when user is authenticated and has no repos", () => {
      beforeEach(() => {
        wrapper = renderWithContext(Provider, {
          props: { match: { params: { provider } } },
          context: {
            bitbucket: {
              accessToken: "access-token",
              user: jest.fn().mockReturnValue(user),
              repositories: jest.fn().mockReturnValue({ values: [] }),
              teams: jest.fn().mockReturnValue({
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
              }),
            },
          },
        });
      });

      test("should show the selected account", () => {
        expect(wrapper.getByText("stormkit-dev")).toBeTruthy();
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
        wrapper = renderWithContext(Provider, {
          props: { match: { params: { provider } } },
          context: {
            bitbucket: {
              accessToken: "access-token",
              user: jest.fn().mockReturnValue(user),
              repositories: jest.fn().mockReturnValue({
                values: [
                  { name: "my-repo", full_name: "stormkit-dev/my-repo" },
                  {
                    name: "my-other-repo",
                    full_name: "stormkit-dev/my-other-repo",
                  },
                ],
              }),
              teams: jest.fn().mockReturnValue({
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
              }),
            },
          },
        });
      });

      test("should display stormkit-dev as the selected account", () => {
        expect(wrapper.getByText(/stormkit-dev/)).toBeTruthy();
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
