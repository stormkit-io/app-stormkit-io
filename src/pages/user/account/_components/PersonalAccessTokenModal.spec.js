import { withMockContext } from "~/~/testing/helpers";
import userEvent from "@testing-library/user-event";
import { fireEvent, waitFor } from "@testing-library/react";
import * as nocks from "~/testing/nocks";

const fileName = "pages/user/account/_components/PersonalAccessTokenModal";

describe(fileName, () => {
  const path = `~/${fileName}`;
  let wrapper;

  const createWrapper = ({ props }) => {
    wrapper = withMockContext({ path, props });
    return wrapper;
  };

  describe("when personal access token is not yet set", () => {
    beforeEach(() => {
      createWrapper({
        props: {
          hasToken: false,
        },
      });
    });

    test("should display an informative message that the token was already set", () => {
      expect(wrapper.getByText("Set personal access token")).toBeTruthy();

      expect(() =>
        wrapper.getByText(
          "There is already a personal access token associated with this account. Submit a new one to overwrite."
        )
      ).toThrow();
    });

    test("should make an api call when submit is clicked", async () => {
      const token = "my-personal-access-token";
      const scope = nocks.mockUpdatePersonalAccessToken({ payload: { token } });

      // Type the token
      userEvent.type(wrapper.getByLabelText("Personal access token"), token);

      // Click on the submit button
      const button = wrapper.getByText("Submit");
      fireEvent.click(button);

      // Wait that we receive a confirmation message
      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
        expect(
          wrapper.getByText(
            "The access token has been updated successfully. From now on, it'll be used to connect to the provider."
          )
        ).toBeTruthy();
      });
    });
  });

  describe("when has a personal access token already set", () => {
    beforeEach(() => {
      createWrapper({
        props: {
          hasToken: true,
        },
      });
    });

    test("should display an informative message that the token was already set", () => {
      expect(wrapper.getByText("Reset personal access token")).toBeTruthy();

      expect(
        wrapper.getByText(
          "There is already a personal access token associated with this account. Submit a new one to overwrite."
        )
      ).toBeTruthy();
    });

    test("should make an api call when delete old one button is clicked", async () => {
      const scope = nocks.mockUpdatePersonalAccessToken({
        payload: { token: "" },
      });

      // Click on the delete button
      const button = wrapper.getByText("Delete existing token");
      fireEvent.click(button);

      // Wait that we receive a confirmation message
      await waitFor(() => {
        expect(scope.isDone()).toBe(true);
        expect(
          wrapper.getByText(
            "The access token has been deleted successfully. From now on, oAuth will be used as the authentication method."
          )
        ).toBeTruthy();
      });
    });
  });
});
