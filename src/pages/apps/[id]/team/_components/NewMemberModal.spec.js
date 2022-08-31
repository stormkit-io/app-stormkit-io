import { waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { withMockContext } from "~/testing/helpers";
import * as nocks from "~/testing/nocks";

const fileName = "pages/apps/[id]/team/_components/NewMemberModal";

describe(fileName, () => {
  const app = { id: "1" };
  const path = `~/${fileName}`;
  let wrapper;

  beforeEach(() => {
    wrapper = withMockContext(path, {
      app,
      toggleModal: jest.fn(),
      isOpen: true,
    });
  });

  test.skip("should contain the title", () => {
    expect(wrapper.getByText("Invite new member")).toBeTruthy();
  });

  test.skip("should display an info message that describes the process", () => {
    expect(
      wrapper.getByText(
        "Enter the username to invite your colleague to the team. In the next step you'll get a link to share."
      )
    ).toBeTruthy();
  });

  test.skip("should contain the referral form with a custom submit", async () => {
    const token = "some-token-to-be-returned";
    const displayName = "stormkit-dev";
    const provider = "github";
    const scope = nocks.mockInviteMemberCall({
      app,
      displayName,
      provider,
      response: { token },
    });

    const userNameInput = wrapper.getByLabelText("User display name");
    userEvent.type(userNameInput, displayName);
    fireEvent.click(wrapper.getByText("Invite user"));

    await waitFor(() => {
      expect(scope.isDone()).toBe(true);
      expect(wrapper.getByLabelText("Copy token").value).toBe(
        "http://localhost/app/invitation/accept?token=some-token-to-be-returned"
      );
    });
  });
});
