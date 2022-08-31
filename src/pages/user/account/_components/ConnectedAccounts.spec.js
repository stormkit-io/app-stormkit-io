import { withMockContext } from "~/~/testing/helpers";
import { fireEvent } from "@testing-library/react";

const fileName = "pages/user/account/_components/ConnectedAccounts";

describe(fileName, () => {
  const path = `~/${fileName}`;
  let wrapper;

  const createWrapper = ({ props }) => {
    wrapper = withMockContext({ path, props });
    return wrapper;
  };

  describe.each`
    provider       | human          | hasPersonalAccessTokenSupport
    ${"github"}    | ${"GitHub"}    | ${false}
    ${"gitlab"}    | ${"GitLab"}    | ${true}
    ${"bitbucket"} | ${"Bitbucket"} | ${false}
  `("For provider", ({ provider, human, hasPersonalAccessTokenSupport }) => {
    beforeEach(() => {
      createWrapper({
        props: {
          accounts: [
            { provider: "github", hasPersonalAccessToken: false },
            { provider: "gitlab", hasPersonalAccessToken: false },
            { provider: "bitbucket", hasPersonalAccessToken: false },
          ],
        },
      });
    });

    test.skip("should display the provider as a connected account", () => {
      expect(wrapper.getByText(human)).toBeTruthy();
    });

    test.skip("should display a set personal access token link", () => {
      const parent = wrapper
        .getByText(human)
        .closest(`[data-testid=${provider}]`);

      expect(/Set personal access token/.test(parent.innerHTML)).toBe(
        hasPersonalAccessTokenSupport
      );
    });
  });

  describe("when has personal access token", () => {
    let toggleModal;

    beforeEach(() => {
      toggleModal = jest.fn();

      createWrapper({
        props: {
          accounts: [{ provider: "gitlab", hasPersonalAccessToken: true }],
          toggleModal,
        },
      });
    });

    test.skip("displays reset instead of set when hasPersonalAccessToken is true", () => {
      expect(
        wrapper.getAllByText("Reset personal access token")[0]
      ).toBeTruthy();
    });

    test.skip("the link should toggle the modal", () => {
      fireEvent.click(wrapper.getAllByText("Reset personal access token")[0]);
      expect(toggleModal).toHaveBeenCalledWith(true);
    });
  });
});
