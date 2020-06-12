import { fireEvent, waitFor } from "@testing-library/react";
import { withUserContext } from "~/testing/helpers";

describe("pages/Apps/New", () => {
  let wrapper;

  const findGithubButton = () => wrapper.getByText("GitHub");
  const findGitlabButton = () => wrapper.getByText("GitLab");
  const findBitbucketButton = () => wrapper.getByText("Bitbucket");
  const findHavingIssues = () => wrapper.getByText(/Having issues/);
  const findEmail = () => wrapper.getByText("hello@stormkit.io");

  afterEach(() => {
    window.open = undefined;
  });

  describe("always", () => {
    beforeEach(() => {
      window.open = jest.fn();
      wrapper = withUserContext({ path: "/apps/new" });
    });

    test("should contain 3 buttons", async () => {
      await waitFor(() => {
        expect(findGithubButton()).toBeTruthy();
        expect(findBitbucketButton()).toBeTruthy();
        expect(findGitlabButton()).toBeTruthy();
      });
    });

    test("should contain link to email support", async () => {
      await waitFor(() => {
        expect(findHavingIssues()).toBeTruthy();
        expect(findEmail()).toBeTruthy();
      });
    });
  });

  describe.each`
    provider       | human          | selector
    ${"github"}    | ${"GitHub"}    | ${findGithubButton}
    ${"gitlab"}    | ${"GitLab"}    | ${findGitlabButton}
    ${"bitbucket"} | ${"Bitbucket"} | ${findBitbucketButton}
  `("For provider", ({ provider, human, selector }) => {
    describe(provider, () => {
      beforeEach(() => {
        window.open = jest.fn().mockImplementation((...args) => {
          const callback = args[3];
          callback({
            sessionToken: "abc-123",
            accessToken: "abc-123",
            user: { id: "1" },
          });
        });

        wrapper = withUserContext({ path: "/apps/new" });
      });

      afterEach(() => {
        window.open.mockReset();
        window.open = undefined;
      });

      test(`clicking to ${provider} should open a ${human} login screen`, async () => {
        await waitFor(() => {
          fireEvent.click(selector());
        });

        expect(window.open).toHaveBeenCalledWith(
          `http://localhost/auth/${provider}`,
          "oauthWindow",
          "toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=600,left=100,top=100",
          expect.anything()
        );

        expect(wrapper.history.entries[0].pathname).toBe(`/apps/new`);

        await waitFor(() =>
          expect(wrapper.history.entries[1].pathname).toBe(
            `/apps/new/${provider}`
          )
        );
      });
    });
  });
});
