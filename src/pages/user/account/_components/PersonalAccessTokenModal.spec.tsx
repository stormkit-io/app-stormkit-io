import type { RenderResult } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { mockUpdatePersonalAccessToken } from "~/testing/nocks/nock_user";
import PersonalAccessTokenModal from "./PersonalAccessTokenModal";

interface Props {
  hasToken: boolean;
}

describe("~/pages/user/account/_components/PersonalAccessTokenModal", () => {
  let toggleModal: jest.Func;
  let wrapper: RenderResult;

  const createWrapper = ({ hasToken }: Props) => {
    toggleModal = jest.fn();

    wrapper = render(
      <PersonalAccessTokenModal hasToken={hasToken} toggleModal={toggleModal} />
    );
  };

  describe("when personal access token is not yet set", () => {
    beforeEach(() => {
      createWrapper({
        hasToken: false,
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
      const scope = mockUpdatePersonalAccessToken({ payload: { token } });

      // Type the token
      await userEvent.type(wrapper.getByLabelText("Token"), token);

      // Click on the submit button
      fireEvent.click(wrapper.getByText("Submit"));

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
        hasToken: true,
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
      const scope = mockUpdatePersonalAccessToken({
        payload: { token: "" },
      });

      // Click on the delete button
      fireEvent.click(wrapper.getByText("Delete existing token"));

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
